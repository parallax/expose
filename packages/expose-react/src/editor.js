import { Schema } from 'prosemirror-model'
import { baseKeymap, toggleMark, setBlockType } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'
import { Plugin } from 'prosemirror-state'

export default function editor(whitelist = [], location) {
  let schema = {
    nodes: {
      text: {
        group: 'inline'
      },
      doc: {
        content:
          // TODO
          includes(whitelist, 'p') || includes(whitelist, 'h1')
            ? 'block*'
            : 'inline*'
      }
    },
    marks: {}
  }
  let kmap = {}
  let items = []

  // paragraph
  if (includes(whitelist, 'p')) {
    schema.nodes.paragraph = {
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'p' }],
      toDOM() {
        return ['p', 0]
      }
    }
  }

  // headings
  let headings = whitelist
    .filter(t => /h[1-6]/.test(t))
    .map(t => parseInt(t.substr(1), 10))
    .sort()

  if (headings.length > 0) {
    schema.nodes.heading = {
      attrs: { level: { default: headings[0] } },
      content: 'inline*',
      group: 'block',
      defining: true,
      parseDOM: headings.map(h => ({ tag: `h${h}`, attrs: { level: h } })),
      toDOM(node) {
        return ['h' + node.attrs.level, 0]
      }
    }
  }

  // bold / strong
  if (includes(whitelist, 'b') || includes(whitelist, 'strong')) {
    schema.marks.strong = {
      parseDOM: [
        { tag: 'strong' },
        // This works around a Google Docs misbehavior where
        // pasted content will be inexplicably wrapped in `<b>`
        // tags with a font-weight normal.
        {
          tag: 'b',
          getAttrs: node => node.style.fontWeight !== 'normal' && null
        },
        {
          style: 'font-weight',
          getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
        }
      ],
      toDOM() {
        return ['strong', 0]
      }
    }
  }

  // italic
  if (includes(whitelist, 'i') || includes(whitelist, 'em')) {
    schema.marks.em = {
      parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
      toDOM() {
        return ['em', 0]
      }
    }
  }

  // link
  if (includes(whitelist, 'a')) {
    schema.marks.link = {
      attrs: {
        href: {},
        title: { default: null }
      },
      inclusive: false,
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs(dom) {
            return {
              href: dom.getAttribute('href'),
              title: dom.getAttribute('title')
            }
          }
        }
      ],
      toDOM(node) {
        return ['a', node.attrs, 0]
      }
    }
  }

  let pmSchema = new Schema(schema)

  // lists
  /*let nodes = addListNodes(pmSchema.spec.nodes, 'inline*', 'block')
  nodes = nodes.update('doc', { content: 'block*' })
  console.log(nodes)
  // console.dir(nodes)
  pmSchema = new Schema({ nodes, marks: schema.marks })
  items.push({
    command: wrapInList(pmSchema.nodes.bullet_list),
    active: state => {
      let { $from, to, node } = state.selection
      if (node) return node.hasMarkup(pmSchema.nodes.list_item)
      return (
        to <= $from.end() && $from.parent.hasMarkup(pmSchema.nodes.list_item)
      )
    },
    dom: icon('ul')
  })*/

  if (includes(whitelist, 'b') || includes(whitelist, 'strong')) {
    kmap['Mod-b'] = toggleMark(pmSchema.marks.strong)
    items.push({
      name: 'b',
      command: kmap['Mod-b'],
      active: state => markActive(state, pmSchema.marks.strong)
    })
  }

  if (includes(whitelist, 'i') || includes(whitelist, 'em')) {
    kmap['Mod-i'] = toggleMark(pmSchema.marks.em)
    items.push({
      name: 'i',
      command: kmap['Mod-i'],
      active: state => markActive(state, pmSchema.marks.em)
    })
  }

  // paragraph
  if (includes(whitelist, 'p')) {
    let pCommand = setBlockType(pmSchema.nodes.paragraph)
    items.push({
      name: 'p',
      command: pCommand,
      active: state => {
        let { $from, to, node } = state.selection
        if (node) return node.hasMarkup(pmSchema.nodes.paragraph)
        return (
          to <= $from.end() && $from.parent.hasMarkup(pmSchema.nodes.paragraph)
        )
      }
    })
  }

  // headings
  headings.forEach(h => {
    let command = setBlockType(pmSchema.nodes.heading, { level: h })
    items.push({
      name: `h${h}`,
      command: command,
      active: state => {
        let { $from, to, node } = state.selection
        if (node) return node.hasMarkup(pmSchema.nodes.heading, { level: h })
        return (
          to <= $from.end() &&
          $from.parent.hasMarkup(pmSchema.nodes.heading, { level: h })
        )
      }
    })
  })

  return {
    schema: pmSchema,
    plugins: [
      keymap(baseKeymap),
      keymap(kmap),
      new Plugin({
        view(editorView) {
          this.editorView = editorView
          return {
            update() {
              // window.parent &&
              //   window.parent.Expose &&
              //   window.parent.Expose.showTextEditable({
              //     location,
              //     editor: editorView,
              //     commands: items.map(item => ({
              //       ...item,
              //       command: (...args) => {
              //         editorView.focus()
              //         item.command(...args)
              //       },
              //       active: item.active(editorView.state)
              //     }))
              //   })
              window.parent &&
                window.parent.Expose &&
                window.parent.Expose.updateTextEditable({
                  location,
                  editor: editorView,
                  commands: items.map(item => ({
                    ...item,
                    command: (...args) => {
                      editorView.focus()
                      item.command(...args)
                    },
                    active: item.active(editorView.state)
                  }))
                })
            }
          }
          let menuView = new ExposeEditor(items, editorView)
          return menuView
        },
        props: {
          handleDOMEvents: {
            focus: function() {
              window.parent &&
                window.parent.Expose &&
                window.parent.Expose.showTextEditable({
                  location,
                  editor: this.spec.editorView,
                  commands: items.map(item => ({
                    ...item,
                    command: (...args) => {
                      this.spec.editorView.focus()
                      item.command(...args)
                    },
                    active: item.active(this.spec.editorView.state)
                  }))
                })
            }
          }
        }
      })
    ]
  }
}

function hasBlockTypes(whitelist) {
  return includes(whitelist, 'p') || includes(whitelist, 'ul')
}

function includes(haystack, needle) {
  return haystack.indexOf(needle) !== -1
}

function markActive(state, type) {
  let { from, $from, to, empty } = state.selection
  if (empty) return type.isInSet(state.storedMarks || $from.marks())
  else return state.doc.rangeHasMark(from, to, type)
}

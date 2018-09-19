let m = {
  p: 'paragraph',
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  h5: 'heading',
  h6: 'heading',
  ul: 'bullet_list',
  ol: 'ordered_list'
}

export default function editor(prosemirror, whitelist = [], location) {
  if (includes(whitelist, 'ul') || includes(whitelist, 'ol')) {
    whitelist.push('p')
  }
  let content = whitelist
    .map(x => m[x])
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)
  if (content.length === 0) content = ['inline']

  let schema = {
    nodes: {
      text: {
        group: 'inline'
      },
      doc: {
        content: 'inline*'
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

  let pmSchema = new prosemirror.model.Schema(schema)

  // lists
  let nodes = pmSchema.spec.nodes
  if (includes(whitelist, 'ul') || includes(whitelist, 'ol')) {
    nodes = prosemirror.schemaList.addListNodes(nodes, 'block+', 'block')
  }
  nodes = nodes.update('doc', { content: '(' + content.join('|') + ')*' })

  pmSchema = new prosemirror.model.Schema({ nodes, marks: schema.marks })

  if (includes(whitelist, 'ul')) {
    items.push({
      name: 'ul',
      command: prosemirror.schemaList.wrapInList(pmSchema.nodes.bullet_list)
    })
  }
  if (includes(whitelist, 'ol')) {
    items.push({
      name: 'ol',
      command: prosemirror.schemaList.wrapInList(pmSchema.nodes.ordered_list)
    })
  }
  if (includes(whitelist, 'ul') || includes(whitelist, 'ol')) {
    kmap['Enter'] = prosemirror.schemaList.splitListItem(
      pmSchema.nodes.list_item
    )
    items.push({
      name: 'lift',
      command: prosemirror.commands.lift,
      enabled: prosemirror.commands.lift
    })
  }

  if (includes(whitelist, 'b') || includes(whitelist, 'strong')) {
    kmap['Mod-b'] = prosemirror.commands.toggleMark(pmSchema.marks.strong)
    items.push({
      name: 'b',
      command: kmap['Mod-b'],
      active: state => markActive(state, pmSchema.marks.strong)
    })
  }

  if (includes(whitelist, 'i') || includes(whitelist, 'em')) {
    kmap['Mod-i'] = prosemirror.commands.toggleMark(pmSchema.marks.em)
    items.push({
      name: 'i',
      command: kmap['Mod-i'],
      active: state => markActive(state, pmSchema.marks.em)
    })
  }

  // paragraph
  if (includes(whitelist, 'p')) {
    let pCommand = prosemirror.commands.setBlockType(pmSchema.nodes.paragraph)
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
    let command = prosemirror.commands.setBlockType(pmSchema.nodes.heading, {
      level: h
    })
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
      prosemirror.keymap.keymap(kmap),
      prosemirror.keymap.keymap(prosemirror.commands.baseKeymap),
      new prosemirror.state.Plugin({
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
              window.updateHighlight()
              if (whitelist.length === 0) return
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
                    active: item.active ? item.active(editorView.state) : false,
                    enabled: item.enabled
                      ? item.enabled(editorView.state)
                      : true
                  }))
                })
            }
          }
          let menuView = new ExposeEditor(items, editorView)
          return menuView
        },
        props: {
          handleDOMEvents: {
            focus(editorView) {
              if (whitelist.length === 0) return
              window.parent &&
                window.parent.Expose &&
                window.parent.Expose.showTextEditable({
                  location,
                  editor: editorView,
                  commands: items.map(item => ({
                    ...item,
                    command: (...args) => {
                      editorView.focus()
                      item.command(...args)
                    },
                    active: item.active ? item.active(editorView.state) : false,
                    enabled: item.enabled
                      ? item.enabled(editorView.state)
                      : true
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

import React from 'react'
import {
  Router as ReachRouter,
  LocationProvider,
  Location,
  createMemorySource,
  createHistory
} from '@reach/router'
import posed, { PoseGroup } from 'react-pose'

let source = createMemorySource('/')
let history = createHistory(source)
let navigate

let transition = {
  type: 'spring',
  stiffness: 200,
  damping: 20
}

let RouteContainer = posed.div({
  enter: { x: '0%', transition },
  preEnter: { x: '100%', transition },
  exit: { x: '-100%', transition }
})

export default class Router extends React.Component {
  state = {
    primary: true,
    preEnterPose: 'preEnter',
    exitPose: 'exit'
  }
  // static getDerivedStateFromProps({ dir }) {
  //   if (dir === 'back') {
  //     return {
  //       preEnterPose: 'exit',
  //       exitPose: 'preEnter'
  //     }
  //   }
  //   return { preEnterPose: 'preEnter', exitPose: 'exit' }
  // }
  handleClick = e => {
    let a = e.target.closest('a')
    if (!a) return
    if (a.getAttribute('data-back')) {
      this.setState({ preEnterPose: 'exit', exitPose: 'preEnter' })
    } else {
      this.setState({ preEnterPose: 'preEnter', exitPose: 'exit' })
    }
  }
  componentDidMount() {
    navigate = (to, back = false) => {
      let state = back
        ? { preEnterPose: 'exit', exitPose: 'preEnter' }
        : { preEnterPose: 'preEnter', exitPose: 'exit' }

      this.setState({ primary: true, ...state }, () => {
        history.navigate(to)
      })
    }
  }
  static getDerivedStateFromProps({ primary }) {
    return {
      primary
    }
  }
  render() {
    let { children, ...props } = this.props
    return (
      <div
        className="flex-none bg-grey-lighter flex flex-col relative"
        style={{
          width: 304
        }}
        onClickCapture={this.handleClick}
      >
        <div className="logo-container mt-9 absolute z-10 pin-t pin-l w-full pointer-events-none">
          <div className="mx-auto mb-9" style={{ width: 110 }}>
            <div className="relative aspect-ratio-logo">
              <svg
                viewBox="0 0 867.23 208.84"
                className="absolute pin w-full h-full"
              >
                <g fill="#333">
                  <path d="M316.6 138.32c-5.33 18.11-22 33.24-47.73 33.24-28.76 0-54.12-20.67-54.12-56 0-33.45 24.72-55.18 51.56-55.18 32.39 0 51.78 20.67 51.78 54.33 0 4-.43 8.31-.43 8.74h-75c.64 13.85 12.36 23.86 26.42 23.86 13.21 0 20.46-6.6 23.87-16zM290.18 104c-.43-10.44-7.25-20.67-23.44-20.67-14.7 0-22.8 11.08-23.44 20.67zM355.5 115.74l-37.29-52.2h33.66c3.63 5.75 17.26 25.35 20.88 31.11l20.67-31.11h32.17L389 114.89l37.92 53.47h-33.29l-21.94-32.17c-3.84 5.75-17.9 26.42-21.52 32.17h-32zM437 208.84V63.54h27.48v12.78c4.69-8.09 16.41-15.13 32.17-15.13 30.68 0 48.37 23.44 48.37 54.55 0 31.74-19.82 55.18-49.43 55.18-14.49 0-25.14-5.75-30.26-12.78v50.7zm54.06-122.29c-14.48 0-26.2 10.87-26.2 29.4s11.72 29.62 26.2 29.62 26-10.87 26-29.62c0-18.53-11.51-29.4-26-29.4zM663.85 116c0 32.17-23.65 55.61-55 55.61s-55-23.44-55-55.61c0-32.38 23.65-55.61 55-55.61s55 23.18 55 55.61zm-28.33 0c0-19.81-12.79-29.83-26.64-29.83s-26.63 10-26.63 29.83c0 19.6 12.78 29.83 26.63 29.83s26.64-10.06 26.64-29.83zM695.36 133.85c.64 8.31 6.82 16 19.18 16 9.37 0 13.85-4.9 13.85-10.44 0-4.69-3.2-8.52-11.3-10.23L703.24 126c-20.24-4.47-29.4-16.61-29.4-31.31 0-18.75 16.62-34.31 39.21-34.31 29.82 0 39.84 19 41.12 30.26l-23.65 5.32c-.86-6.18-5.33-14.06-17.26-14.06-7.46 0-13.42 4.48-13.42 10.44 0 5.12 3.83 8.31 9.58 9.38l14.92 3.19c20.66 4.26 31.1 16.83 31.1 32.17 0 17.05-13.21 34.52-40.69 34.52-31.53 0-42.4-20.45-43.68-32.39zM865.74 138.32c-5.32 18.11-21.94 33.24-47.72 33.24-28.77 0-54.12-20.67-54.12-56 0-33.45 24.72-55.18 51.56-55.18 32.39 0 51.77 20.67 51.77 54.33 0 4-.42 8.31-.42 8.74h-75c.64 13.85 12.36 23.86 26.42 23.86 13.21 0 20.45-6.6 23.86-16zM839.32 104c-.42-10.44-7.24-20.67-23.43-20.67-14.7 0-22.8 11.08-23.44 20.67z" />
                </g>
                <circle
                  cx="110.69"
                  cy="72.59"
                  r="72.59"
                  transform="rotate(-6.9 110.659 72.596)"
                  fill="#cebeec"
                />
                <ellipse
                  cx="67.14"
                  cy="119.61"
                  rx="67.17"
                  ry="67.11"
                  transform="rotate(-45.03 67.144 119.61)"
                  fill="#8360d6"
                />
                <circle cx="134.28" cy="152.43" r="32.82" fill="#3c374e" />
              </svg>
            </div>
          </div>
        </div>
        <div
          className="overflow-auto overflow-x-hidden"
          style={{ paddingTop: 160 }}
        >
          <LocationProvider history={history}>
            <Location>
              {({ location }) => (
                <PoseGroup
                  preEnterPose={this.state.preEnterPose}
                  exitPose={this.state.exitPose}
                >
                  <RouteContainer key={location.pathname}>
                    <ReachRouter
                      location={location}
                      primary={this.state.primary}
                    >
                      {children}
                    </ReachRouter>
                  </RouteContainer>
                </PoseGroup>
              )}
            </Location>
          </LocationProvider>
        </div>
      </div>
    )
  }
}

export { history, navigate }

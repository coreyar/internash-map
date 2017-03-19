import React from 'react'

import {ScriptCache} from './lib/ScriptCache'
import GoogleApi from './lib/GoogleApi'

const defaultCreateCache = (options) => {
  options = options || {}
  const apiKey = options.apiKey
  const libraries = ['places',  'visualization']

  return ScriptCache({
    google: GoogleApi({apiKey: apiKey, libraries})
  })
}

export const wrapper = (options) => (WrappedComponent) => {
  const createCache = options.createCache || defaultCreateCache

  class Wrapper extends React.Component {
    constructor (props, context) {
      super(props, context)

      this.scriptCache = createCache(options)
      this.scriptCache.google.onLoad(this.onLoad.bind(this))

      this.state = {
        loaded: false,
        map: null,
        google: null
      }
    }

    onLoad (err, tag) {
      this._gapi = window.google

      this.setState({loaded: true, google: this._gapi})

      if (err) {
        console.log(err)
      }
    }

    render () {
      const props = Object.assign({}, this.props, {
        loaded: this.state.loaded,
        google: window.google
      })

      return (
        <div>
          <WrappedComponent {...props} />
          <div ref='map' />
        </div>
      )
    }
    }

  return Wrapper
}

export default wrapper

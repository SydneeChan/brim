/* @flow */

import React from "react"
import type {Layout} from "./Layout"
import type {RowRenderer} from "./types"
import isEqual from "lodash/isEqual"
import Log from "../../models/Log"
import * as Styler from "./Styler"

type Props = {
  selectedLog: ?Log,
  rowRenderer: RowRenderer,
  layout: Layout,
  rows: number[],
  logs: Log[]
}

export default class Chunk extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    if (!isEqual(this.props.rows, nextProps.rows)) {
      return true
    }

    if (!isEqual(this.props.layout.columns, nextProps.layout.columns)) {
      return true
    }

    if (this.props.selectedLog !== nextProps.selectedLog) {
      return true
    }

    for (let index of this.props.rows) {
      if (!Log.isSame(this.props.logs[index], nextProps.logs[index]))
        return true
    }

    return false
  }

  render() {
    const {rowRenderer, layout, rows} = this.props
    return (
      <div className="chunk" style={Styler.chunk(layout, rows[0], rows.length)}>
        {rows.map(index => rowRenderer(index, layout))}
      </div>
    )
  }
}
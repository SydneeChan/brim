import {Thunk} from "../state/types"
import Current from "../state/Current"
import Spaces from "../state/Spaces"
import Tabs from "../state/Tabs"
import {getZealot} from "./getZealot"

export default (
  workspaceId: string,
  spaceId: string,
  name: string
): Thunk<Promise<void>> => (dispatch, getState) => {
  const state = getState()
  const zealot = dispatch(getZealot())
  const tabs = Tabs.getData(state)

  return zealot.spaces.update(spaceId, {name}).then(() => {
    dispatch(Spaces.rename(workspaceId, spaceId, name))
    tabs.forEach((t) => {
      if (t.current.spaceId === spaceId)
        dispatch(Current.setSpaceId(spaceId, t.id))
    })
  })
}

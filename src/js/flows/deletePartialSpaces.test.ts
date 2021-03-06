import {createZealotMock} from "zealot"

import Workspaces from "../state/Workspaces"
import Current from "../state/Current"
import fixtures from "../test/fixtures"
import deletePartialSpaces from "./deletePartialSpaces"
import initTestStore from "../test/initTestStore"
import Handlers from "../state/Handlers"

const testSpaceId1 = "testSpaceId1"
const testSpaceId2 = "testSpaceId2"

let store, zealot
beforeEach(() => {
  zealot = createZealotMock()
  const ws = fixtures("workspace1")
  store = initTestStore(zealot.zealot)
  store.dispatch(Workspaces.add(ws))
  store.dispatch(Current.setWorkspaceId(ws.id))
})

test("reset current space id if mid-ingest", async () => {
  zealot.stubPromise("spaces.delete", true)
  store.dispatch(
    Handlers.register("id-1", {type: "INGEST", spaceId: testSpaceId1})
  )
  zealot.stubPromise("spaces.delete", true)
  store.dispatch(
    Handlers.register("id-2", {type: "INGEST", spaceId: testSpaceId2})
  )
  store.dispatch(Current.setSpaceId(testSpaceId1))

  await store.dispatch(deletePartialSpaces())

  expect(zealot.calls("spaces.delete")).toHaveLength(2)
  expect(Current.getSpaceId(store.getState())).toEqual(null)
})

test("dont reset current id if not mid-ingest", async () => {
  zealot.stubPromise("spaces.delete", true)
  store.dispatch(
    Handlers.register("id-2", {type: "INGEST", spaceId: testSpaceId2})
  )
  store.dispatch(Current.setSpaceId(testSpaceId1))

  await store.dispatch(deletePartialSpaces())

  expect(zealot.calls("spaces.delete")).toHaveLength(1)
  expect(Current.getSpaceId(store.getState())).toEqual(testSpaceId1)
})

import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import {} from "@graphprotocol/graph-ts"
import { idLog } from "../generated/schema"
import { idLog as idLogEvent } from "../generated/ungrundid/ungrundid"
import { handleidLog } from "../src/ungrundid"
import { createidLogEvent } from "./ungrundid-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let _metadata = "Example string value"
    let _subjkt = "Example string value"
    let newidLogEvent = createidLogEvent(_metadata, _subjkt)
    handleidLog(newidLogEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("idLog created and stored", () => {
    assert.entityCount("idLog", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "idLog",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_metadata",
      "Example string value"
    )
    assert.fieldEquals(
      "idLog",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_subjkt",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})

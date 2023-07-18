import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { swapLog } from "../generated/schema"
import { swapLog as swapLogEvent } from "../generated/wuweiswapv1/wuweiswapv1"
import { handleswapLog } from "../src/wuweiswapv-1"
import { createswapLogEvent } from "./wuweiswapv-1-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let erc1155 = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let amount = BigInt.fromI32(234)
    let value = BigInt.fromI32(234)
    let tokenId = BigInt.fromI32(234)
    let op = BigInt.fromI32(234)
    let swapId = BigInt.fromI32(234)
    let newswapLogEvent = createswapLogEvent(
      erc1155,
      amount,
      value,
      tokenId,
      op,
      swapId
    )
    handleswapLog(newswapLogEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("swapLog created and stored", () => {
    assert.entityCount("swapLog", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "swapLog",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "erc1155",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "swapLog",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )
    assert.fieldEquals(
      "swapLog",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "value",
      "234"
    )
    assert.fieldEquals(
      "swapLog",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenId",
      "234"
    )
    assert.fieldEquals(
      "swapLog",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "op",
      "234"
    )
    assert.fieldEquals(
      "swapLog",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "swapId",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})

import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { swapLog } from "../generated/wuweiswapv1/wuweiswapv1"

export function createswapLogEvent(
  erc1155: Address,
  amount: BigInt,
  value: BigInt,
  tokenId: BigInt,
  op: BigInt,
  swapId: BigInt
): swapLog {
  let swapLogEvent = changetype<swapLog>(newMockEvent())

  swapLogEvent.parameters = new Array()

  swapLogEvent.parameters.push(
    new ethereum.EventParam("erc1155", ethereum.Value.fromAddress(erc1155))
  )
  swapLogEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  swapLogEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )
  swapLogEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  swapLogEvent.parameters.push(
    new ethereum.EventParam("op", ethereum.Value.fromUnsignedBigInt(op))
  )
  swapLogEvent.parameters.push(
    new ethereum.EventParam("swapId", ethereum.Value.fromUnsignedBigInt(swapId))
  )

  return swapLogEvent
}

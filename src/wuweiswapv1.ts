import { swapLog as swapLogEvent } from "../generated/wuweiswapv1/wuweiswapv1"
import { swap } from "../generated/schema"

export function handleswapLog(event: swapLogEvent): void {
  let swap = new swap(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  swap.erc1155 = event.params.erc1155
  swap.tokenId = event.params.tokenId
  swap.issuer = event.transaction.from
  swap.amount = event.params.amount
  swap.value = event.params.value
  swap.op = event.params.op
  swap.swapId = event.params.swapId
  swap.block = event.block.number
  swap.timestamp = event.block.timestamp
  swap.hash = event.transaction.hash
  swap.save()
}

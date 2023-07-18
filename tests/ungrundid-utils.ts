import { newMockEvent } from "matchstick-as"
import { ethereum } from "@graphprotocol/graph-ts"
import { idLog } from "../generated/ungrundid/ungrundid"

export function createidLogEvent(_metadata: string, _subjkt: string): idLog {
  let idLogEvent = changetype<idLog>(newMockEvent())

  idLogEvent.parameters = new Array()

  idLogEvent.parameters.push(
    new ethereum.EventParam("_metadata", ethereum.Value.fromString(_metadata))
  )
  idLogEvent.parameters.push(
    new ethereum.EventParam("_subjkt", ethereum.Value.fromString(_subjkt))
  )

  return idLogEvent
}

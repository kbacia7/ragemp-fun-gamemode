import { XMLFileRequest } from "core/FileRequest/XMLFileRequest"
import { I18nTranslate } from "core/i18n/I18nTranslate"
import { InternationalizationSettings } from "core/i18n/InternationalizationSettings"
/*tslint:disable:ordered-imports*/
import $ from "jquery"
import "bootstrap"
import { PromiseFactory } from "core/PromiseFactory/PromiseFactory"
import "./style.less"
import { Item } from "server/entity/Item"
import { PlayerItem } from "server/entity/PlayerItem"
import { EquipmentModuleEvent } from "client/modules/EquipmentModule/EquipmentModuleEvent"
import { ItemSection } from "server/entity/ItemSection"
import { Lootbox } from "server/entity/Lootbox"
import { LootboxItem } from "server/entity/LootboxItem"
import { LootboxPlayerModuleEvents } from "client/modules/LootboxPlayerModule/LootboxPlayerModuleEvents"
import random from "random"

const promiseFactory = new PromiseFactory<string>()
const xmlFileRequest = new XMLFileRequest(promiseFactory)
const internationalizationSettings = new InternationalizationSettings("pl_PL")
const i18nTranslator = new I18nTranslate(internationalizationSettings, xmlFileRequest)
const allItemIds = []
let closeButton: boolean = false
$(document).ready(() => {
    i18nTranslator.loadTranslations("/translations")
    $("[data-i18n-translate]").toArray().forEach((element: HTMLElement) => {
      element.innerText = i18nTranslator.translate(element.getAttribute("data-i18n-translate"))
    })
    $(document).on("click", "#lootbox-open", () => {
      $("#lootbox-open").text(
        i18nTranslator.translate(
          "LOOTBOX_OPENING",
        ),
      ).attr("disabled", "true")
      mp.trigger(LootboxPlayerModuleEvents.OPEN_LOOTBOX)
    })
    $(document).on("click", "#lootbox-close", () => {
      mp.trigger(LootboxPlayerModuleEvents.CLOSE_LOOTBOX)
    })
})

const _global: any = (window || global) as any
_global.showItemFromLootbox = (givenItemId: number) => {
  $(".lootbox-item-fade").animate({
    opacity: "0.3",
  }, 2000)
  let randomItemId: number  = allItemIds[random.int(0, allItemIds.length - 1)]
  while (givenItemId !== randomItemId) {
    $(`[data-item-id='${randomItemId}']`).find(".lootbox-item-fade").animate({
      opacity: "0.7",
    }, 1000)
    randomItemId = allItemIds[random.int(0, allItemIds.length - 1)]
  }
  $(`[data-item-id='${randomItemId}']`).find(".lootbox-item-fade").animate({
    opacity: "0",
  }, 1000)
  closeButton = true
}

_global.displayItemsForLootbox = (lootboxAsString: string) => {
  const lootbox: Lootbox = JSON.parse(lootboxAsString)
  $("#lootbox-select").addClass("d-none")
  const minRows = 3
  const rowSample = $("#lootbox-example-row")
  const columnSample = $("#lootbox-example-item")
  const columnSize = 2

  const lootboxContainer = $("#lootbox-container")
  lootboxContainer.children().not("#lootbox-example-row").not("#lootbox-example-item").not("button").remove()
  const maxRowSize = 12
  let loaded = 0
  let loadedRows = 0
  let rowToAppend = null

  lootbox.lootbox_items.forEach((lootboxItem: LootboxItem) => {
    const item = lootboxItem.item
    if (loaded * columnSize % maxRowSize === 0) {
      if (rowToAppend) {
        lootboxContainer.append(rowToAppend)
      }
      rowToAppend = rowSample.clone()
      rowToAppend.removeAttr("id")
      loadedRows++
    }
    const newColumn = columnSample.clone()
    newColumn.removeAttr("id")
    const image = newColumn.find(`.item-image`)
    image.attr("src", item.filename)
    const chanceForItem = parseFloat(((lootboxItem.chance / lootbox.max_chance) * 100).toFixed(1).toString())
    newColumn.find(".lootbox-chance").text(`${chanceForItem}%`)
    newColumn.attr("data-item-id", item.id)
    rowToAppend.append(newColumn)
    allItemIds.push(item.id)
    loaded++
  })

  let lastTmpLoaded = null
  for (; loadedRows <= minRows; loadedRows++) {
    for (let extraCol = 0; extraCol <= maxRowSize / columnSize; extraCol++) {
      if (lastTmpLoaded !== loaded && loaded * columnSize % maxRowSize === 0) {
        if (rowToAppend) {
          lootboxContainer.append(rowToAppend)
        }
        rowToAppend = rowSample.clone()
        rowToAppend.removeAttr("id")
        lastTmpLoaded = loaded
        break
      }
      const newColumn = columnSample.clone()
      newColumn.removeAttr("id")
      rowToAppend.append(newColumn)
      loaded++
    }

  }
  if (loaded * columnSize % maxRowSize !== 0) {
    lootboxContainer.append(rowToAppend)
  }
  $("#lootbox-select").removeClass("d-none")
}

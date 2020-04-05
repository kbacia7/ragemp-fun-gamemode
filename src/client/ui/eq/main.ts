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

const promiseFactory = new PromiseFactory<string>()
const xmlFileRequest = new XMLFileRequest(promiseFactory)
const internationalizationSettings = new InternationalizationSettings("pl_PL")
const i18nTranslator = new I18nTranslate(internationalizationSettings, xmlFileRequest)
let sections: {[index: string]: ItemSection} = {}
let itemsBySection: {[index: string]: PlayerItem[]} = {}
$(document).ready(() => {
    i18nTranslator.loadTranslations("/translations")
    $("[data-i18n-translate]").toArray().forEach((element: HTMLElement) => {
      element.innerText = i18nTranslator.translate(element.getAttribute("data-i18n-translate"))
    })

    $(document).on("click", ".eq-card", (ev) => {
      let target = ev.target
      let section = $(target).attr("data-eq-card-name")
      // tslint:disable: no-console
      console.log(target)
      if (!section) {
        target = $(target).closest("[data-eq-card-name]")
        section = $(target).attr("data-eq-card-name")
      }
      displayItemsForSection(section)

    })

    $(document).on("click", "#eq-close", () => {
      mp.trigger(EquipmentModuleEvent.HIDE_EQ)
    })
    $(document).on("click", "#eq-item-description-equip-button", () => {
      console.log("cliic")
      console.log(itemsBySection)
      let thisPlayerItem: PlayerItem = null
      Object.keys(itemsBySection).forEach((section) => {
        itemsBySection[section].forEach((playerItem: PlayerItem) => {
          if (playerItem && playerItem.item.id === parseInt($("[data-eq-item-id]").attr("data-eq-item-id"), 10)) {
            thisPlayerItem = playerItem
          }
        })
      })
      const equipped: boolean = thisPlayerItem.equipped

      if (equipped) {
        $("#eq-item-description-equip-button").text(
          i18nTranslator.translate(
            "EQ_UNEQUIP",
          ),
        )
      } else {
        i18nTranslator.translate(
          "EQ_EQUIP",
        )
      }
      $("#eq-select").addClass("d-none")
      mp.trigger(EquipmentModuleEvent.TRY_EQUIP_ITEM, thisPlayerItem.item.id)
    })
    updateEquippedItems()
})

const _global: any = (window || global) as any

const displayItemInformations = (playerItem: PlayerItem) => {
  const item: Item = playerItem.item
  $("[data-eq-item-id]").attr("data-eq-item-id", item.id)
  $("#eq-item-title").text(
    i18nTranslator.translate(
      item.title_display_name,
    ),
  )
  $("#eq-item-description").removeClass("d-none")
  $("#eq-item-description-content").text(item.description)
  $("#eq-item-description-equip-button").text(
    i18nTranslator.translate(
      playerItem.equipped ? "EQ_UNEQUIP" : "EQ_EQUIP",
    ),
  )
}

const updateEquippedItems = () => {
  Object.keys(itemsBySection).forEach((section: string) => {
    const equipped: string[] = itemsBySection[section].filter((playerItem) => playerItem.equipped === true)
      .map((p) => i18nTranslator.translate(p.item.title_display_name))

    const stringEquipped = equipped.join(", ")
    $(`[data-eq-card-name='${section}']`).find(".equipped").text(stringEquipped)
  })
}

const displayItemsForSection = (section: string) => {
  $("#eq-select").addClass("d-none")
  $("#eq-item-description").addClass("d-none")
  $(".eq-item-active-display-informations").removeClass("eq-item-active-display-informations")
  const minRows = 7
  const rowSample = $("#eq-select-example-row")
  const columnSample = $("#eq-select-example-item")
  const columnSize = sections[section] ? sections[section].column_size : 2
  const isCustomSize = !columnSize.toString().includes(".0")
  const oneColumnSizePercent = 8.3

  if (isCustomSize) {
    const w = `${columnSize * oneColumnSizePercent}%`
    columnSample.css("width", w)
    columnSample.css("flex", `0 0 ${w}`)
    columnSample.css("max-width", w)
  } else {
    columnSample.removeClass("col-2")
    columnSample.addClass(`col-${parseInt(columnSize.toString(), 10)}`)
  }

  const eqContainer = $("#eq-select-container")
  eqContainer.children().not("#eq-select-example-row").not("#eq-select-example-item").remove()
  const maxRowSize = 12
  let loaded = 0
  let loadedRows = 0
  let rowToAppend = null

  if (itemsBySection[section]) {

  itemsBySection[section].forEach((playerItem: PlayerItem) => {
    const item = playerItem.item
    if (loaded * columnSize % maxRowSize === 0) {
      if (rowToAppend) {
        eqContainer.append(rowToAppend)
      }
      rowToAppend = rowSample.clone()
      rowToAppend.removeAttr("id")
      loadedRows++
    }
    const newColumn = columnSample.clone()
    newColumn.removeAttr("id")
    const image = newColumn.find(`.item-image`)
    image.attr("src", item.filename)
    image.on("click", (ev) => {
      $(".eq-item-active-display-informations").removeClass("eq-item-active-display-informations")
      displayItemInformations(playerItem)
      newColumn.addClass("eq-item-active-display-informations")
    })
    rowToAppend.append(newColumn)
    loaded++
  })
}

  let lastTmpLoaded = null
  for (; loadedRows <= minRows; loadedRows++) {
    for (let extraCol = 0; extraCol <= maxRowSize / columnSize; extraCol++) {
      if (lastTmpLoaded !== loaded && loaded * columnSize % maxRowSize === 0) {
        if (rowToAppend) {
          eqContainer.append(rowToAppend)
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
    eqContainer.append(rowToAppend)
  }
  $("#eq-select").removeClass("d-none")
}

_global.loadPlayerItems = (playerItemsAsJson: string) => {
  const playerItems: PlayerItem[] = JSON.parse(playerItemsAsJson)
  itemsBySection = {}
  sections = {}
  playerItems.forEach((playerItem: PlayerItem) => {
    const item: Item = playerItem.item
    if (!itemsBySection[item.section.name]) {
      itemsBySection[item.section.name] = []
    }
    itemsBySection[item.section.name].push(playerItem)
    sections[item.section.name] = item.section

  })
  updateEquippedItems()
}

export function isFormValid(event, component) {
  // reset CSS, empty errorMessages and fieldsWithErrorCSSArray to do a fresh check
  resetCSS(event, component);
  component.eMessages = [];
  component.fieldsWithErrorCSSArray = [];
  let isValid = true;
  // if required field is empty, change the field css, add it to fieldsWithErrorCSSArray, and add error message
  isValid = checkIfBasicInfoIsValid(event, component, isValid)
  isValid = checkIfCustomFieldsAreValid(event, component, isValid)
  isValid = checkIfSurveysAreValid(event, component, isValid)
  isValid = checkIfLinksAreValid(event, component, isValid)
  return isValid;
}

function checkIfBasicInfoIsValid(event, component, isValid) {
  if (!event.country) {
    isValid = false;
    component.eMessages.push("Country can not be empty");
    component.$refs.myBasicInfo.$refs.country.style.borderColor = "red";
    component.fieldsWithErrorCSSArray.push({ type: "basic", ref: "country" });
  }

  if (!event.city) {
    isValid = false;
    component.eMessages.push("City can not be empty");
    component.$refs.myBasicInfo.$refs.city.style.borderColor = "red";
    component.fieldsWithErrorCSSArray.push({ type: "basic", ref: "city" });
  }

  if (!event.startDate) {
    isValid = false;
    component.eMessages.push("Start date can not be empty");
    component.$refs.myBasicInfo.$refs.startDate.style.borderColor = "red";
    component.fieldsWithErrorCSSArray.push({ type: "basic", ref: "startDate" });
  }

  if (!event.endDate) {
    isValid = false;
    component.eMessages.push("End date can not be empty");
    component.$refs.myBasicInfo.$refs.endDate.style.borderColor = "red";
    component.fieldsWithErrorCSSArray.push({ type: "basic", ref: "endDate" });
  }

  if (!event.deadLine) {
    isValid = false;
    component.eMessages.push("Application deadline can not be empty");
    component.$refs.myBasicInfo.$refs.deadLine.style.borderColor = "red";
    component.fieldsWithErrorCSSArray.push({ type: "basic", ref: "deadLine" });
  }

  return isValid
}

function checkIfCustomFieldsAreValid(event, component, isValid) {
  if (event.customFields.length > 0) {
    for (let i = 0; i < event.customFields.length; i++) {
      if (!event.customFields[i].customFieldDescription) {
        isValid = false;
        component.eMessages.push("CustomField " + (i + 1) + " can not be empty");
        component.fieldsWithErrorCSSArray.push({
          type: "customFields",
          ref: "text" + i,
        });
        component.$refs.myBasicInfo.$refs.customFields.$refs[
          "text" + i
        ].style.borderColor = "red";
        component.$refs.myBasicInfo.$refs.customFields.$refs[
          "text" + i
        ].style.borderWidth = "2px";
      }
    }
  }
  return isValid
}

function checkIfSurveysAreValid(event, component, isValid) {
  if (event.surveys.length > 0) {
    for (let i = 0; i < event.surveys.length; i++) {
      let hasEmpty = false;
      let titleRef = "title" + i;
      if (!event.surveys[i].questionTitle) {
        component.$refs.myBasicInfo.$refs.surveys.$refs[
          titleRef
        ].style.borderColor = "red";
        component.fieldsWithErrorCSSArray.push({
          type: "surveys",
          ref: titleRef,
        });
        hasEmpty = true;
      }

      if (event.surveys[i].type === "select") {
        for (
          let a = 0;
          a < event.surveys[i].options.length;
          a++
        ) {
          if (!event.surveys[i].options[a]) {
            let ref = i + "option" + a;
            component.$refs.myBasicInfo.$refs.surveys.$refs[
              ref
            ].style.borderColor = "red";
            component.fieldsWithErrorCSSArray.push({
              type: "surveys",
              ref: ref,
            });
            hasEmpty = true;
          }
        }
      }
      if (hasEmpty) {
        isValid = false;
        component.eMessages.push("Survey " + (i + 1) + " can not be empty");
      }
    }
  }
  return isValid
}

function checkIfLinksAreValid(event, component, isValid) {
  if (event.links.length > 0) {
    for (let i = 0; i < event.links.length; i++) {
      let hasEmpty = false;
      if (!event.links[i].linkTitle) {
        let ref = "title" + i;
        component.$refs.myBasicInfo.$refs.links.$refs[ref].style.borderColor =
          "red";
        component.fieldsWithErrorCSSArray.push({ type: "links", ref: ref });
        hasEmpty = true;
      }
      if (!event.links[i].linkDescription) {
        let ref = "link" + i;
        component.$refs.myBasicInfo.$refs.links.$refs[ref].style.borderColor =
          "red";
        component.fieldsWithErrorCSSArray.push({ type: "links", ref: ref });
        hasEmpty = true;
      }
      if (hasEmpty) {
        isValid = false;
        component.eMessages.push("Link " + (i + 1) + " can not be empty");
      }
    }
  }
  return isValid
}

export function changeCSS(event, component) {
  // loop through every element in fieldsWithErrorCSSArray and reset their css
  component.fieldsWithErrorCSSArray.forEach((obj) => {
    switch (obj.type) {
      case "basic": {
        component.$refs.myBasicInfo.$refs[obj.ref].style.borderColor = "red";
        break;
      }
      case "customFields": {
        changeCustomFieldsCSS(event, component, obj)
        break;
      }
      case "surveys": {
        changeSurveyCSS(event, component, obj)
        break;
      }
      case "links": {
        changeLinksCSS(event, component, obj)
        break;
      }
    }
  });
}

function changeCustomFieldsCSS(event, component, o) {
  if (event.customFields.length != 0) {
    if (component.$refs.myBasicInfo.$refs.customFields.$refs[o.ref]) {
      component.$refs.myBasicInfo.$refs.customFields.$refs[
        o.ref
      ].style.borderColor = "red";

      component.$refs.myBasicInfo.$refs.customFields.$refs[
        o.ref
      ].style.borderWidth = "2px";
    }
  }
}

function changeSurveyCSS(event, component, o) {
  if (event.surveys.length != 0) {
    if (component.$refs.myBasicInfo.$refs.surveys.$refs[o.ref]) {
      component.$refs.myBasicInfo.$refs.surveys.$refs[
        o.ref
      ].style.borderColor = "red";
    }
  }
}

function changeLinksCSS(event, component, o) {
  if (event.links.length != 0) {
    if (component.$refs.myBasicInfo.$refs.links.$refs[o.ref]) {
      component.$refs.myBasicInfo.$refs.links.$refs[
        o.ref
      ].style.borderColor = "red";
    }
  }
}

// reset error field's css
export function resetCSS(event, component) {
  component.hasError = false;
  // loop through every element in fieldsWithErrorCSSArray and reset their css
  component.fieldsWithErrorCSSArray.forEach((obj) => {
    switch (obj.type) {
      case "basic": {
        component.$refs.myBasicInfo.$refs[obj.ref].style.borderColor = "";
        break;
      }
      case "customFields": {
        resetCustomFieldsCSS(event, component, obj)
        break;
      }
      case "surveys": {
        resetSurveyCSS(event, component, obj)
        break;
      }
      case "links": {
        resetLinksCSS(event, component, obj)
        break;
      }
    }
  });
}

function resetCustomFieldsCSS(event, component, o) {
  if (event.customFields.length != 0) {
    if (component.$refs.myBasicInfo.$refs.customFields.$refs[o.ref]) {
      component.$refs.myBasicInfo.$refs.customFields.$refs[
        o.ref
      ].style.borderColor = "";

      component.$refs.myBasicInfo.$refs.customFields.$refs[
        o.ref
      ].style.borderWidth = "";
    }
  }
}

function resetSurveyCSS(event, component, o) {
  if (event.surveys.length != 0) {
    if (component.$refs.myBasicInfo.$refs.surveys.$refs[o.ref]) {
      component.$refs.myBasicInfo.$refs.surveys.$refs[
        o.ref
      ].style.borderColor = "";
    }
  }
}

function resetLinksCSS(event, component, o) {
  if (event.links.length != 0) {
    if (component.$refs.myBasicInfo.$refs.links.$refs[o.ref]) {
      component.$refs.myBasicInfo.$refs.links.$refs[
        o.ref
      ].style.borderColor = "";
    }
  }
}

export function checkIfObjectsAreIdentical(newObj, oldObj) {
  // push every property name of the obj into array
  let propertiesOfNew = Object.getOwnPropertyNames(newObj);
  let propertiesOfOld = Object.getOwnPropertyNames(oldObj);
  return isEveryPropertiesIdentical(newObj, oldObj, propertiesOfNew, propertiesOfOld);
}

function isEveryPropertiesIdentical(newObj, oldObj, propertiesOfNew, propertiesOfOld) {
  let isIdentical = true;
  // check if length are identical first to avoid wasting resources
  if (propertiesOfNew.length != propertiesOfOld.length) {
    isIdentical = false;
    return isIdentical;
  }

  for (let i = 0; i < propertiesOfNew.length; i++) {
    let propertyName = propertiesOfNew[i];
    // compare all non array properties
    // skip array property to avoid wasting resources on for loop
    if (
      newObj[propertyName] != oldObj[propertyName] &&
      !Array.isArray(newObj[propertyName])
    ) {
      isIdentical = false;
      return isIdentical;
    }

    // compare all array properties
    // compare length of array first, and then details
    if (newObj[propertyName] != oldObj[propertyName]) {
      if (propertyName === "customFields") {
        if (!areCustomFieldsIdentical(newObj, oldObj, propertyName, isIdentical)) {
          isIdentical = false;
          return isIdentical;
        }
      } else if (propertyName === "accommodations") {
        if (!areAccommodationsIdentical(newObj, oldObj, propertyName, isIdentical)) {
          isIdentical = false;
          return isIdentical;
        }
      }
      else if (propertyName === "surveys") {
        if (!areSurveysIdentical(newObj, oldObj, propertyName, isIdentical)) {
          isIdentical = false;
          return isIdentical;
        }
      }
      else if (propertyName === "images") {
        if (!areImagesIdentical(newObj, oldObj, propertyName, isIdentical)) {
          isIdentical = false;
          return isIdentical;
        }
      }
      else if (propertyName === "links") {
        if (!areLinksIdentical(newObj, oldObj, propertyName, isIdentical)) {
          isIdentical = false;
          return isIdentical;
        }
      }
    }
  }
  return isIdentical;
}

function areLinksIdentical(newObj, oldObj, propertyName, isIdentical) {
  if (!isIdentical) return isIdentical
  if (newObj[propertyName].length != oldObj[propertyName].length) {
    isIdentical = false;
    return isIdentical;
  }
  for (
    let index = 0;
    index < newObj[propertyName].length;
    index++
  ) {
    if ((newObj[propertyName][index].linkTitle !=
      oldObj[propertyName][index].linkTitle) || (newObj[propertyName][index].linkDescription !=
        oldObj[propertyName][index].linkDescription)) {
      isIdentical = false;
      return isIdentical;
    }
  }
  return isIdentical
}

function areImagesIdentical(newObj, oldObj, propertyName, isIdentical) {
  if (!isIdentical) return isIdentical
  if (newObj[propertyName].length != oldObj[propertyName].length) {
    isIdentical = false;
    return isIdentical;
  }
  for (
    let index = 0;
    index < newObj[propertyName].length;
    index++
  ) {
    if (newObj[propertyName][index].src !=
      oldObj[propertyName][index].src) {
      isIdentical = false;
      return isIdentical;
    }
  }
  return isIdentical;
}

function areSurveysIdentical(newObj, oldObj, propertyName, isIdentical) {
  if (!isIdentical) return isIdentical
  if (newObj[propertyName].length != oldObj[propertyName].length) {
    isIdentical = false;
    return isIdentical;
  }
  for (
    let index = 0;
    index < newObj[propertyName].length;
    index++
  ) {
    if ((newObj[propertyName][index].questionTitle !=
      oldObj[propertyName][index].questionTitle) || (newObj[propertyName][index].type !=
        oldObj[propertyName][index].type)) {
      isIdentical = false;
      return isIdentical;
    }
  }
  return isIdentical
}

function areCustomFieldsIdentical(newObj, oldObj, propertyName, isIdentical) {
  if (!isIdentical) return isIdentical
  if (newObj[propertyName].length != oldObj[propertyName].length) {
    isIdentical = false;
    return isIdentical;
  }
  for (
    let index = 0;
    index < newObj[propertyName].length;
    index++
  ) {
    if (!isIdentical) return
    if (
      newObj[propertyName][index].customFieldDescription !=
      oldObj[propertyName][index].customFieldDescription
    ) {
      isIdentical = false;
      return isIdentical;
    }
  }
  return isIdentical;
}

function areAccommodationsIdentical(newObj, oldObj, propertyName, isIdentical) {
  if (!isIdentical) return isIdentical
  if (newObj[propertyName].length != oldObj[propertyName].length) {
    isIdentical = false;
    return isIdentical;
  }
  for (let app = 0; app < newObj[propertyName].length; app++) {
    // checking accommodations
    if (!isIdentical) return
    if (
      newObj[propertyName][app].accommodationDescription !=
      oldObj[propertyName][app].accommodationDescription ||
      newObj[propertyName][app].accommodationTitle !=
      oldObj[propertyName][app].accommodationTitle
    ) {
      isIdentical = false;
      return isIdentical;
    }
    // checking rooms of accommodation
    if (!areRoomsIdentical(newObj[propertyName][app].rooms, oldObj[propertyName][app].rooms, isIdentical)) {
      isIdentical = false;
      return isIdentical;
    }
  }
  return isIdentical
}

function areRoomsIdentical(newRoomList, oldRoomList, isIdentical) {
  for (
    let roomIndex = 0;
    roomIndex < newRoomList.length;
    roomIndex++
  ) {
    if (!isIdentical) return isIdentical
    if (
      newRoomList.length !=
      oldRoomList.length ||
      newRoomList[roomIndex].roomDescription !=
      oldRoomList[roomIndex].roomDescription ||
      newRoomList[roomIndex].roomTitle !=
      oldRoomList[roomIndex].roomTitle
    ) {
      isIdentical = false;
      return isIdentical;
    }
    if (!areBedsIdentical(newRoomList[roomIndex].beds, oldRoomList[roomIndex].beds, isIdentical)) {
      isIdentical = false;
      return isIdentical;
    }
  }
  return isIdentical
}

function areBedsIdentical(newBedList, oldBedList, isIdentical) {
  for (
    let bedIndex = 0;
    bedIndex < newBedList.length;
    bedIndex++
  ) {
    if (!isIdentical) return isIdentical
    // checking beds of component roomIndex of component accommodation
    if (
      newBedList.length !=
      oldBedList.length
    ) {
      isIdentical = false;
      return isIdentical;
    }
    if (
      newBedList[bedIndex].bedSize !=
      oldBedList[bedIndex].bedSize
    ) {
      isIdentical = false;
      return isIdentical;
    }
    // if bedSize is "doubleBed", compare isShareable
    // since "singleBed" does not have isShareable field
    else if (
      newBedList[bedIndex].bedSize === "doubleBed"
    ) {
      if (
        newBedList[bedIndex]
          .isShareable !=
        oldBedList[bedIndex]
          .isShareable
      ) {
        isIdentical = false;
        return isIdentical;
      }
    }
  }
  return isIdentical
}

export function saveDraft(event, orginalEvent, component, eventID) {
  // check if user made any change after loading event, saveDraft if so
  if (
    !checkIfObjectsAreIdentical(
      event,
      orginalEvent
    )
  ) {
    let saveDraft = JSON.stringify(event);
    localStorage.setItem("draft" + eventID, saveDraft);
    component.showDraftNoti = true;
    component.timer = setTimeout(() => {
      component.showDraftNoti = false;
    }, 5000);
  } else {
    console.log("got in but didn't save since identical")
  }
}

export function resetEdit(wantsReset, component, event) {
  // reset to loading origin base on if loaded from draft or not
  if (wantsReset) {
    component.event = JSON.parse(
      JSON.stringify(component.selectedDetailEvent)
    );
    component.showTab = "basicInfoContainer";
    resetAllIndex(component);
    if (event.accommodations.length > 0) {
      component.showAccommodation = true;
    } else {
      component.showAccommodation = false;
    }
    component.showOverView = false;
    component.showNavAndBtn = true;
    component.$refs.undoConfirmModal.style.display = "none";
  } else {
    component.showTab = "basicInfoContainer";
    component.showNavAndBtn = true;
    component.$refs.undoConfirmModal.style.display = "none";
  }
}

export function backToPrevStep(tempObj, component) {
  if (tempObj.type === "accommodation") {
    component.showTab = "showApartmentInfo";
  } else if (tempObj.type === "room") {
    component.showTab = "addAccommodation";
  } else if (tempObj.type === "bed") {
    component.showTab = "addRoom";
  }
}

export function showNext(component) {
  switch (component.showTab) {
    case "basicInfoContainer": {
      component.showTab = "showApartmentInfo";
      component.showAccommodation = true;
      break;
    }
    case "showApartmentInfo": {
      component.showTab = "confirm";
      component.showOverView = true;
      break;
    }
    case "addAccommodation": {
      component.showTab = "confirm";
      component.showOverView = true;
      break;
    }
    case "addRoom": {
      component.showTab = "confirm";
      component.showOverView = true;
      break;
    }

    case "addBed": {
      component.showTab = "confirm";
      component.showOverView = true;
      break;
    }
    case "confirm": {
      component.tryToSave();
      break;
    }
  }
}

export function showPrev(component) {
  switch (component.showTab) {
    case "basicInfoContainer": {
      break;
    }
    case "showApartmentInfo": {
      component.showTab = "basicInfoContainer";
      component.showOverView = false;
      break;
    }
    case "addAccommodation": {
      component.showTab = "showApartmentInfo";
      component.showOverView = false;
      break;
    }
    case "addRoom": {
      component.showTab = "addAccommodation";
      component.showOverView = false;
      break;
    }

    case "addBed": {
      component.showTab = "addRoom";
      component.showOverView = false;
      break;
    }
    case "confirm": {
      component.showTab = "showApartmentInfo";
      component.showOverView = false;
      break;
    }
  }
}

export function removeDeletedItemFromErrorCSS(deletedItem, component) {
  for (let i = 0; i < component.fieldsWithErrorCSSArray.length; i++) {
    if (component.fieldsWithErrorCSSArray[i] == deletedItem) {
      component.fieldsWithErrorCSSArray.splice(i, 1);
    } else if (component.fieldsWithErrorCSSArray[i].type == "links") {
      if (
        component.fieldsWithErrorCSSArray[i].ref === deletedItem.ref ||
        component.fieldsWithErrorCSSArray[i].ref === deletedItem.ref2
      ) {
        component.fieldsWithErrorCSSArray.splice(i, 1);
      }
    }
  }
}

export function checkBeforeSave(event, component) {
  component.timer = setTimeout(() => {
    if (isFormValid(event, component)) {
      component.saveEventToDB();
    } else {
      component.hasError = true;
      component.timer = setTimeout(() => {
        let element = document.getElementById("scrollToWhenError");
        element.scrollIntoView();
      }, 100);
    }
  }, 100);
}

// updateEvent if child component user changed something
export function updateEvent(tempObj, event, component) {
  if (tempObj.type === "basicInfo") {
    delete tempObj.type;
    let accommodations = event.accommodations;
    event = tempObj;
    event.accommodations = accommodations;
  } else if (tempObj.type === "accommodation") {
    delete tempObj.type;
    if (tempObj.accommodationTitle === "") {
      tempObj.accommodationTitle =
        "Accommodation" + (component.apartmentIndex + 1);
    }
    event.accommodations[component.apartmentIndex] = tempObj;
  } else if (tempObj.type === "accommodations") {
    delete tempObj.type;
    event.accommodations = tempObj.accommodations;
  } else if (tempObj.type === "room") {
    delete tempObj.type;
    if (!tempObj.roomTitle) {
      tempObj.roomTitle =
        "Room" + (component.roomIndex + 1);
    }
    event.accommodations[component.apartmentIndex].rooms[component.roomIndex] =
      tempObj;
  } else if (tempObj.type === "bed") {
    if (tempObj.size === "DoubleBed") {
      event.accommodations[component.apartmentIndex].rooms[
        component.roomIndex
      ].beds[component.bedIndex].bedSize = tempObj.size;

      event.accommodations[component.apartmentIndex].rooms[
        component.roomIndex
      ].beds[component.bedIndex].isShareable = tempObj.shareable;
    } else {
      event.accommodations[component.apartmentIndex].rooms[
        component.roomIndex
      ].beds[component.bedIndex].bedSize = tempObj.size;
    }
  }
}

export function getDraft(eventID, event, component) {
  let loadDraft = localStorage.getItem("draft" + eventID);
  if (loadDraft) {
    // copy currentEvent from draft
    event = JSON.parse(loadDraft);
    component.showTab = "basicInfoContainer";

    // event is the event that user is editing and saving
    // selectedDetailEvent is a copy of the "orginal" event
    // if user decide to load draft, make draft "orginal" instead of DB
    component.selectedDetailEvent = JSON.parse(JSON.stringify(event));
    component.eMessages = [];
    component.fieldsWithErrorCSSArray = [];
    resetCSS(event, component);
    resetAllIndex(component);
    component.showNavAndBtn = true;
    component.showOverView = false;
    component.saveDraftInterval = setInterval(() => {
      saveDraft(
        event,
        component.selectedDetailEvent,
        component,
        eventID
      );
    }, 30000);

    if (event.accommodations.length > 0) {
      component.showAccommodation = true;
    }
  }
  return event
}

export function resetAllIndex(component) {
  component.apartmentIndex = null;
  component.roomIndex = null;
  component.bedIndex = null;
}

export function addAcc(component) {
  component.showTab = "addAccommodation";
  let count;
  // add accommodation with a default name
  if (component.event.accommodations.length === 0) {
    count = 1;
  } else {
    count = component.event.accommodations.length + 1;
  }
  let rt = "Accommodation" + count;
  component.event.accommodations.push({ accommodationTitle: rt, rooms: [] });
  component.apartmentIndex = component.event.accommodations.length - 1;
}

export function addRoom(component, obj) {
  // since there are multiple places user can click to add room
  // check if that component sent any apartmentIndex
  if (obj) {
    component.apartmentIndex = obj.accIndex;
  }

  component.showTab = "addRoom";
  let count;
  // add room to accommodation with a default name
  if (component.event.accommodations[component.apartmentIndex].rooms.length === 0) {
    count = 1;
  } else {
    count = component.event.accommodations[component.apartmentIndex].rooms.length + 1;
  }
  let rt = "Room" + count;
  component.event.accommodations[component.apartmentIndex].rooms.push({
    roomTitle: rt,
    beds: [],
  });
  component.roomIndex =
    component.event.accommodations[component.apartmentIndex].rooms.length - 1;
}

export function addBed(component, roomIndex) {
  component.showTab = "addBed";
  component.roomIndex = roomIndex;
  component.event.accommodations[component.apartmentIndex].rooms[
    component.roomIndex
  ].beds.push({ bedSize: "SingleBed" });

  component.bedIndex =
    component.event.accommodations[component.apartmentIndex].rooms[component.roomIndex]
      .beds.length - 1;

  //create bed ID
  let bedID = component.selectedEvent + "-" + component.apartmentIndex + "-" + component.roomIndex + "-" + component.bedIndex

  component.event.accommodations[component.apartmentIndex].rooms[
    component.roomIndex
  ].beds[component.bedIndex].bedID = bedID;
}



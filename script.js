/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  // your code here
  const counterID = document.getElementById('coffee_counter');
  counterID.innerText = coffeeQty;
}

function clickCoffee(data) {
  // your code here
  ++data.coffee;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  // your code here
  producers.forEach(producer => {
    if(producer.unlocked === true) return;
    if(coffeeCount >= producer.price) producer.unlocked = true;
  })
}

function getUnlockedProducers(data) {
  // your code here
  const unlockers = (accumulator, producer) => {
    if (producer.unlocked === true) accumulator.push(producer);
    return accumulator;
  }
  const producers = data.producers;
  let unlocked  = producers.reduce(unlockers,[]);
  return unlocked;
}
  
function makeDisplayNameFromId(id) {
  // your code here
  function capatalizer(string) {
    const arr = string.split('_');
    let capitalArr = arr.map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    return  capitalArr.join(' ');

  }
  if(!Array.isArray(id)) {
    return capatalizer(id);
  }
  else {
    let capitalArr = [];
    id.forEach(input_string => {
      capitalArr.push(capatalizer(input_string));
      return capitalArr;
    })
  }
  return id;
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  // your code here
  const child_nodes = Array.from(parent.childNodes);
  child_nodes.forEach(child => {
  parent.removeChild(child); 
  });
}

function renderProducers(data) {
  // your code here
  // Gets the div container 
  const producer_area = document.getElementById('producer_container');
  // Unlocks the producers and then gets the unlocked ones
  unlockProducers(data.producers, data.coffee);
  const unlocked_producers = getUnlockedProducers(data);
  
  const unlocked_divs = unlocked_producers.map(producer => makeProducerDiv(producer));
   
  // Removes the old children
  const previous_children = producer_area.children;
  Array.from(previous_children).forEach(alte_kinder => producer_area.removeChild(alte_kinder));

  // append divs to container
  unlocked_divs.forEach(div => producer_area.append(div));
  
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  // your code here
  const producers = data.producers;
  for(let i = 0; i < producers.length; ++i) {
    const element = producers[i];
    if (element.id === producerId) return element;
  }
}

function canAffordProducer(data, producerId) {
  // your code here
  const producer = getProducerById(data, producerId);
  if(data.coffee >= producer.price) return true;
  else return false;
}

function updateCPSView(cps) {
  // your code here
  const cps_object = document.getElementById('cps');
  cps_object.innerText = cps;
}

function updatePrice(oldPrice) {
  // your code here
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  // your code here
  const afford = canAffordProducer(data, producerId); 
  if (afford) {
    const producer = getProducerById(data, producerId);
    // increment quanitity
    ++producer.qty;
    data.coffee -= producer.price;
    
    // changes price
    producer.price = updatePrice(producer.price);
    
    // Updates cps
    data.totalCPS += producer.cps;
  }
  return afford;
}

function buyButtonClick(event, data) {
  // your code here
  function getProducerId(buy_id) {
    const str_arr = buy_id.split('_');
    str_arr.shift();
    return str_arr.join('_');
  }
  if(event.target.tagName === 'BUTTON') { 

    const producer_id = getProducerId(event.target.id);
    const afford = attemptToBuyProducer(data, producer_id);
    if(afford) {
      renderProducers(data); 
      updateCPSView(data.totalCPS);
      updateCoffeeView(data.coffee);

    } else {
      window.alert('Not enough coffee!');
    }
  }
}

function tick(data) {
  // your code here
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}

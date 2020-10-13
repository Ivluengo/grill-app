const grills = document.getElementById('grills');
const selectMenu = document.getElementById('selectMenu');
selectMenu.addEventListener('change', (e) => runApp(e, true));

for (let i = 1; i <= 15; i++) {
  let selectOption = document.createElement('option');
  menuNumber = i < 10 ? "0"+ i : i ;
  selectOption.setAttribute('value', `${menuNumber}`);
  selectOption.innerHTML = `Menu ${menuNumber}`;
  selectMenu.appendChild(selectOption);
}

let grillNumber = 0;
function runApp(e, fetch, newGrillItems) {  
  if(fetch) {
    grillNumber = 0;
    resetGrill();
    const fetchGrillItems = getGrillItems(e.target.value);  
    fetchGrillItems.then(data => {  
      const grillItems = createExpandedItems(data);
      sortItems(grillItems);
      var packer = new Packer(300,200);
      packer.fit(grillItems);
      drawGrill();  
      drawGrillItems(grillItems);  
      createNewGrills(grillItems);    
    });
  } else {    
      sortItems(newGrillItems);
      var packer = new Packer(300,200);
      packer.fit(newGrillItems);
      drawGrill();  
      drawGrillItems(newGrillItems);  
      createNewGrills(newGrillItems); 
  }
}

function createExpandedItems(items) {
  let grillItems = []; 
  items.forEach(item => {
    for (let i=0; i<item.Quantity; i++){
      let grillItem = {
        h: item.Width * 10,
        w: item.Length * 10,
        name: item.Name
      }
      grillItems.push(grillItem);
    }
  })
  return grillItems; 
}

function sortItems(grillItems) {
  grillItems.sort(function (a,b) { return Math.max(b.w, b.h) - Math.max(a.w, a.h); })
}

function resetGrill(){
  while(grills.lastChild) {
    grills.lastChild.remove();
  }
}  

function drawGrill(){
  let grill = document.createElement('div');
  grill.innerHTML = `<h2 class="grillTitle">Round ${grillNumber + 1}</h2>`
  grill.classList.add('grill', `grill${grillNumber+1}`, 'animated', 'fadeInDown');
  grills.appendChild(grill);
  grillNumber++;
}

function drawGrillItems(grillItems) {  
  let block = 0;
  let len = grillItems.length;
  for (let i=0 ; i<len ; i++) {
    block = grillItems[i];    
    if (block.fit){
      let grillItem = document.createElement('div');
      const font = block.w * 0.01;
      grillItem.innerHTML = `
        <p style="font-size: ${font > 1.5  ? 1.5 : font}em" class="grillItemName">${block.name}</p>
      `;
      grillItem.classList.add('grillItem');
      grillItem.style.width = `${block.w}px`;
      grillItem.style.height = `${block.h}px`;
      grillItem.style.background = `${setColorByName(block.name)}`;
      grillItem.style.left = `${block.fit.x}px`;
      grillItem.style.top = `${block.fit.y}px`;      
      document.querySelector(`.grill${grillNumber}`).appendChild(grillItem);
    }
  }
}

function createNewGrills(grillItems) {
  let block;
  let len = grillItems.length;
  let newGrillItems = [];
    for (let i = 0 ; i < len ; i++) {
      block = grillItems[i];
      if (!block.fit){    
        newGrillItems.push(block);
      }
    }    
    if(newGrillItems.length > 0)
      runApp(null, false, newGrillItems);    
}

function setColorByName(name) {
  switch(name) {
    case "Paprika Sausage":
      return "#ffa5a5";
    case "Veal":
      return "#cdc9c3";
    case "Rumpsteak":
      return "#b83b5e";
    case "Chipolata Sausage":
      return "#dddddd"; 
    case "Steak":
      return "#ff7171";
    case "Chicken":
      return "#ffd571";
    case "Shrimp":
      return "#efbbcf";
    case "Sausage":
      return "#ffd5cd";
  }
}

async function getGrillItems(menuNum) {
  try{
    const response = await fetch('../data/menus.json');   
    const data = await response.json();
    const filteredMenu = data.filter(item => item.menu === `Menu ${menuNum}`);    
    const grillItems = filteredMenu[0].items;
    return grillItems;
  } catch(error) {
    console.log(error);    
  }   
}
const ratio = document.getElementById('ratio');
const noFit = document.getElementById('nofit');
const canvas = document.getElementById('canvas');
const grills = document.getElementById('grills');
const selectMenu = document.getElementById('selectMenu');
selectMenu.addEventListener('change', runApp);

//Setting the binpacking options


//creating the select options
for (let i = 1; i <= 15; i++) {
  let selectOption = document.createElement('option');
  menuNumber = i < 10 ? "0"+ i : i ;
  selectOption.setAttribute('value', `${menuNumber}`);
  selectOption.innerHTML = `Menu ${menuNumber}`;
  selectMenu.appendChild(selectOption);
}

function runApp(e) {
  resetGrill();
  const fetchGrillItems = getGrillItems(e.target.value);
  
  fetchGrillItems.then(data => { 
    
    const grillItems = createExpandedBlocks(data);
    sortItems(grillItems);
    var packer = new Packer(300,200);
    packer.fit(grillItems);
    console.log(grillItems);
    drawGrillItems(grillItems);

    report(grillItems, packer.root.w, packer.root.h);
    
  });

}


function createExpandedBlocks(items) {
  let grillItems = []; 
  items.forEach(item => {
    for (let i=0; i<item.Quantity; i++){
      let grillItem = {
        w: item.Width * 10,
        h: item.Length * 10,
        area: (item.Length * 10) * (item.Width * 10),
        num: item.Quantity,
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
  
function drawGrillItems(grillItems) {  
  let block = 0;
  for (let i = 0 ; i < grillItems.length ; i++) {
    block = grillItems[i];
    
    if (block.fit){
      let grillItem = document.createElement('div');
      grillItem.classList.add('grillItem');
      grillItem.style.width = `${block.w}px`;
      grillItem.style.height = `${block.h}px`;
      grillItem.style.background = `${setColor(i)}`;
      grillItem.style.position = "absolute";
      grillItem.style.left = `${block.fit.x}px`;
      grillItem.style.top = `${block.fit.y}px`;
      grills.appendChild(grillItem);

    }
  }
}







// const draw = canvas.getContext("2d");

// canvas.width  = 301; // add 1 because we draw boundaries offset by 0.5 in order to pixel align and get crisp boundaries
// canvas.height = 201; // (ditto)
// // draw.clearRect(0, 0, canvas.width, canvas.height);
// draw.strokeRect(0.5, 0.5, 300, 200);

// let block = 0;
// for (let i = 0 ; i < expandedBlocks.length ; i++) {
//   block = expandedBlocks[i];
  
//   if (block.fit){
//     draw.fillStyle = setColor(i);
//     draw.strokeStyle = "#161616";
//     draw.fillRect(block.fit.x + 0.5, block.fit.y + 0.5, block.w, block.h);  
//     draw.save();
//     draw.rotate(-0.5*Math.PI)
//     draw.fillStyle = "#161616";
//     draw.fillText('hola', block.fit.x + (block.w / 2.5), block.fit.y + (block.h / 2), block.w);
//     draw.restore();
//   }
// }













function report(blocks, w, h) {
  let fit = 0, nofit = [], block, len = blocks.length;
    for (let n = 0 ; n < len ; n++) {
      block = blocks[n];
      if (block.fit)
        fit = fit + block.area;
      else
        nofit.push("" + block.w + "x" + block.h);
    }
    ratio.innerHTML = Math.round(100 * fit / (w * h));
    if(nofit.length > 0) {
      noFit.innerHTML = "Did not fit (" + nofit.length + ") :<br>" + nofit.join(", ");
      noFit.classList.toggle('displayBlock');
    }
}

function setColor(n) {
  let colors = [ "#FFF7A5", "#FFA5E0", "#A5B3FF", "#BFFFA5", "#FFCBA5" ];
  return colors[n % colors.length];
}


//Getting the grill items for the selected menu
async function getGrillItems(menuNum) {

  try{
    const response = await fetch('http://isol-grillassessment.azurewebsites.net/api/GrillMenu');
    const data = await response.json();
    const filteredMenu = data.filter(item => item.menu === `Menu ${menuNum}`);    
    const grillItems = filteredMenu[0].items;
    return grillItems;

  } catch(error) {
    console.log(error);    
  } 
  
}
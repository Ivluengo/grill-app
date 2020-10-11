

Demo = {

  init: function() {

    Demo.el = {
      examples: $('#examples'),
      blocks:   $('#blocks'),
      canvas:   $('#canvas')[0],
      size:     $('#size'),
      sort:     $('#sort'),
      color:    $('#color'),
      ratio:    $('#ratio'),
      nofit:    $('#nofit')
    };

    if (!Demo.el.canvas.getContext) // no support for canvas
      return false;

    Demo.el.draw = Demo.el.canvas.getContext("2d");
    Demo.run();

  
  },

  //---------------------------------------------------------------------------

  run: function() {
    
    
    var blocks = [
      { w: 50, h: 120, num:  9 },
      { w: 50, h: 220, num:  3 },
      { w: 30,  h: 50,  num: 10 },
      { w: 30,  h: 60,  num: 4 },
      { w: 70,  h: 150,  num: 3 },
      { w: 50,  h: 100,  num: 5 }
    ];
    var packer = new Packer(300,200);
    blocks.sort(function (a,b) { return Math.max(b.w, b.h) - Math.max(a.w, a.h); })
    console.log(blocks);
    
    //blocks areas
    let expandedBlocks = [];
    blocks.forEach(block => {
      for (let i=0; i<block.num; i++){
        let newBlock = { w: block.w, h: block.h, num: block.num, area: block.w * block.h};
        expandedBlocks.push(newBlock);
      }
    });
    packer.fit(expandedBlocks);
    console.log(expandedBlocks);
    
    Demo.canvas.reset(packer.root.w, packer.root.h);
    Demo.canvas.blocks(expandedBlocks);
    Demo.canvas.boundary(packer.root);
    Demo.report(expandedBlocks, packer.root.w, packer.root.h);
  },


 
  //---------------------------------------------------------------------------

  report: function(blocks, w, h) {
    var fit = 0, nofit = [], block, n, len = blocks.length;
    for (n = 0 ; n < len ; n++) {
      block = blocks[n];
      if (block.fit)
        fit = fit + block.area;
      else
        nofit.push("" + block.w + "x" + block.h);
    }
    Demo.el.ratio.text(Math.round(100 * fit / (w * h)));
    Demo.el.nofit.html("Did not fit (" + nofit.length + ") :<br>" + nofit.join(", ")).toggle(nofit.length > 0);
  },

 
  //---------------------------------------------------------------------------

  canvas: {

    reset: function(width, height) {
      Demo.el.canvas.width  = width  + 1; // add 1 because we draw boundaries offset by 0.5 in order to pixel align and get crisp boundaries
      Demo.el.canvas.height = height + 1; // (ditto)
      Demo.el.draw.clearRect(0, 0, Demo.el.canvas.width, Demo.el.canvas.height);
    },

    
    stroke: function(x, y, w, h) {
      Demo.el.draw.strokeRect(x + 0.5, y + 0.5, w, h);
    },
    
    rect:  function(x, y, w, h, color) {
      Demo.el.draw.fillStyle = color;
      Demo.el.draw.fillRect(x + 0.5, y + 0.5, w, h);
    },
    blocks: function(blocks) {
      var n, block;
      for (n = 0 ; n < blocks.length ; n++) {
        block = blocks[n];
        console.log(block);
        
        if (block.fit)
          Demo.canvas.rect(block.fit.x, block.fit.y, block.w, block.h, Demo.color(n));
      }
    },
    
    boundary: function(node) {
      if (node) {
        Demo.canvas.stroke(node.x, node.y, node.w, node.h);
        Demo.canvas.boundary(node.down);
        Demo.canvas.boundary(node.right);
      }
    }
  },  
 
  //---------------------------------------------------------------------------

  colors: {
    pastel:         [ "#FFF7A5", "#FFA5E0", "#A5B3FF", "#BFFFA5", "#FFCBA5" ],
    basic:          [ "silver", "gray", "red", "maroon", "yellow", "olive", "lime", "green", "aqua", "teal", "blue", "navy", "fuchsia", "purple" ],
    gray:           [ "#111", "#222", "#333", "#444", "#555", "#666", "#777", "#888", "#999", "#AAA", "#BBB", "#CCC", "#DDD", "#EEE" ],
    vintage:        [ "#EFD279", "#95CBE9", "#024769", "#AFD775", "#2C5700", "#DE9D7F", "#7F9DDE", "#00572C", "#75D7AF", "#694702", "#E9CB95", "#79D2EF" ],
    solarized:      [ "#b58900", "#cb4b16", "#dc322f", "#d33682", "#6c71c4", "#268bd2", "#2aa198", "#859900" ],
    none:           [ "transparent" ]
  },

  color: function(n) {
    var cols = Demo.colors["pastel"];
    return cols[n % cols.length];
  }

  //---------------------------------------------------------------------------

}

$(Demo.init);

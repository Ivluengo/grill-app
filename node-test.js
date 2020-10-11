var binpacking = require('./js');
var Packer = binpacking.Packer;


var examples = [

      
        { w: 200, h: 200, num:  1 },
        { w: 250, h: 200, num:  1 },
        { w: 50,  h: 50,  num: 20 }
      
      
];

function templateToBlocks(example) {
	var blocks = [];
	
	example.forEach(function (template) {
		var num = template.num ? template.num : 1;
		for (var i = 0; i < num ; i++) {
			blocks.push({w:template.w, h:template.h});
		}
	});

	return blocks;
}

var packer = new Packer(300, 200);

function quality(blocks) {
	var fitCount = 0;
	var usedCount = 0;

	blocks.forEach(function (block) {
		if(undefined!==block.fit && undefined!==block.fit.x && undefined!==block.fit.y) {
			fitCount++;
		}
		if(undefined!==block.fit && block.fit.used) {
			usedCount++;
		}
	});

	return {
		length : blocks.length,
		used   : usedCount,
		fit    : fitCount,
		status : usedCount === blocks.length && fitCount === blocks.length ? 'ok' : 'fail'};
}

function run(example) {
	var blocks = templateToBlocks(example);
	packer.fit(blocks);
	console.log(quality(blocks));
}

run(examples);
// run(examples.square);
// run(examples.power2);
// run(examples.tall);
// run(examples.wide);
// run(examples.tallwide);
// run(examples.oddeven);
// run(examples.complex);

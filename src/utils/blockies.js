var randseed = new Array(4);
 
  function seedrand(seed) {
   for (var i = 0; i < randseed.length; i++) {
     randseed[i] = 0;
   }
   for (var i = 0; i < seed.length; i++) {
     randseed[i % 4] =
       (randseed[i % 4] << 5) - randseed[i % 4] + seed.charCodeAt(i);
   }
 }
 
  function rand() {
   var t = randseed[0] ^ (randseed[0] << 11);
   randseed[0] = randseed[1];
   randseed[1] = randseed[2];
   randseed[2] = randseed[3];
   randseed[3] = randseed[3] ^ (randseed[3] >> 19) ^ t ^ (t >> 8);
   return (randseed[3] >>> 0) / ((1 << 31) >>> 0);
 }
 
  function createColor() {
   var h = Math.floor(rand() * 360);
   var s = rand() * 60 + 40 + "%";
   var l = (rand() + rand() + rand() + rand()) * 25 + "%";
   var color = "hsl(" + h + "," + s + "," + l + ")";
   return color;
 }
 
  function createImageData(size) {
   var width = size;
   var height = size;
   var dataWidth = Math.ceil(width / 2);
   var mirrorWidth = width - dataWidth;
   var data = [];
   for (var y = 0; y < height; y++) {
     var row = [];
     for (var x = 0; x < dataWidth; x++) {
       row[x] = Math.floor(rand() * 2.3);
     }
     var r = row.slice(0, mirrorWidth);
     r.reverse();
     row = row.concat(r);
     for (var i = 0; i < row.length; i++) {
       data.push(row[i]);
     }
   }
   return data;
 }
 
  function createCanvas(imageData, color, scale, bgcolor, spotcolor) {
   var c = document.createElement("canvas");
   var width = Math.sqrt(imageData.length);
   c.width = c.height = width * scale;
   var cc = c.getContext("2d");
   cc.fillStyle = bgcolor;
   cc.fillRect(0, 0, c.width, c.height);
   cc.fillStyle = color;
   for (var i = 0; i < imageData.length; i++) {
     var row = Math.floor(i / width);
     var col = i % width;
     cc.fillStyle = imageData[i] == 1 ? color : spotcolor;
     if (imageData[i]) {
       cc.fillRect(col * scale, row * scale, scale, scale);
     }
   }
   return c;
 }
 
  function createIcon(opts) {
   opts = opts || {};
   var size = opts.size || 8;
   var scale = opts.scale || 4;
   var seed =
     opts.seed || Math.floor(Math.random() * Math.pow(10, 16)).toString(16);
   seedrand(seed);
   var color = opts.color || createColor();
   var bgcolor = opts.bgcolor || createColor();
   var spotcolor = opts.spotcolor || createColor();
   var imageData = createImageData(size);
   var canvas = createCanvas(imageData, color, scale, bgcolor, spotcolor);
   return canvas;
 }
 
  const blockies = { createBlockie: createIcon };
 
  export default blockies
 
//usage blockies.create({seed:"PUBLIC_ADDRESS".toLowerCase(),size:8,scale:16}).toDataURL(); # will return base64 image
var apiUrl = "";

// FBX処理
function showModal(){
    fileInput = document.getElementById('ModelFileImporter');
    fileInput.onchange = function (event) {
    var file = event.target.files[0];
    var data = new FormData();
    var errors = '';

    if(file === null){
      unitySendMessageStopUpload();
      return;
    }

    // サイズ上限（30MB）
    if (file.size > 30000000)
    {
       errors += 'ファイルサイズ上限の30MBを超えています。\n'
    }
    
    // 拡張子チェック
   if (!fileInput.value.toLowerCase().match(/\.(fbx)$/i)) {
       errors += 'サポート外のファイル形式です。\n'
    }
    
    if (errors)
    {
      alert(errors);
      fileInput.value = ''; 
      return;
    }


var currentDate = '[' + new Date().toUTCString() + '] ';

console.log(currentDate + "upload");
data.append('files', file)

const promise = fetch(apiUrl, {
  method: 'POST',
  body: data
});

unitySendMessageStartUpload();

promise
.then(response => {
  console.log(response.status)

  currentDate = '[' + new Date().toUTCString() + '] ';

  console.log(currentDate);

  unitySendMessageUpload(event.target.files[0].name);
  
  
  fileInput.value = '';  
});
}         
    document.getElementById('ModelFileImporter').click();
}

// GLB処理
function showGlb(){
  fileInput = document.getElementById('GlbFileImporter');
  fileInput.onchange = function (event) {
  var file = event.target.files[0];
  var data = new FormData();
  var errors = '';

  if(file === null){
    unitySendMessageStopUploadGlb();
    return;
  }

  // サイズ上限（30MB）
  if (file.size > 30000000)
  {
     errors += 'ファイルサイズ上限の30MBを超えています。\n'
  }
  
  // 拡張子チェック
  if (!fileInput.value.toLowerCase().match(/\.(glb)$/i)) {
     errors += 'サポート外のファイル形式です。\n'
  }
  
  if (errors)
  {
    alert(errors);
    fileInput.value = ''; 
    return;
  }


var currentDate = '[' + new Date().toUTCString() + '] ';

console.log(currentDate + "upload");
data.append('files', file)

const promise = fetch(apiUrl, {
method: 'POST',
body: data
});

unitySendMessageStartUploadGlb();

promise
.then(response => {
console.log(response.status)

currentDate = '[' + new Date().toUTCString() + '] ';

console.log(currentDate);

unitySendMessageUploadGlb(event.target.files[0].name);


fileInput.value = '';  
});
}         
  document.getElementById('GlbFileImporter').click();
}

// VRM処理
function showVrm(){
fileInput = document.getElementById('VrmFileImporter');
fileInput.onchange = function (event) {
var file = event.target.files[0];
var data = new FormData();
var errors = '';

if(file === null){
  unitySendMessageStopUploadVrm();
  return;
}

// サイズ上限（30MB）
if (file.size > 30000000)
{
   errors += 'ファイルサイズ上限の30MBを超えています。\n'
}

// 拡張子チェック
if (!fileInput.value.toLowerCase().match(/\.(vrm)$/i)) {
   errors += 'サポート外のファイル形式です。\n'
}

if (errors)
{
  alert(errors);
  fileInput.value = ''; 
  return;
}


var currentDate = '[' + new Date().toUTCString() + '] ';

console.log(currentDate + "upload");
data.append('files', file)

const promise = fetch(apiUrl, {
method: 'POST',
body: data
});

unitySendMessageStartUploadVrm();

promise
.then(response => {
console.log(response.status)

currentDate = '[' + new Date().toUTCString() + '] ';

console.log(currentDate);

unitySendMessageUploadVrm(event.target.files[0].name);


fileInput.value = '';  
});
}         
document.getElementById('VrmFileImporter').click();
}


// 画像処理
function showImage(){
  fileInput = document.getElementById('ImageFileImporter');
  fileInput.onchange = function (event) {
  var file = event.target.files[0];
  var data = new FormData();
  var errors = '';

  if(file === null){
    unitySendMessageStopUploadImage();
    return;
  }

  // サイズ上限（10MB）
  if (file.size > 10000000)
  {
     errors += 'ファイルサイズ上限の10MBを超えています。\n'
  }
  
  // 拡張子チェック
　  if (!fileInput.value.toLowerCase().match(/\.(png)$/i)) {
     errors += 'サポート外のファイル形式です。\n'
  }
  
  if (errors)
  {
    alert(errors);
    fileInput.value = ''; 
    return;
  }


var currentDate = '[' + new Date().toUTCString() + '] ';

console.log(currentDate + "upload");
data.append('files', file)

const promise = fetch(apiUrl, {
method: 'POST',
body: data
});

unitySendMessageStartUploadImage();

promise
.then(response => {
console.log(response.status)

currentDate = '[' + new Date().toUTCString() + '] ';

console.log(currentDate);

unitySendMessageUploadImage(event.target.files[0].name);


fileInput.value = '';  
});
}         
  document.getElementById('ImageFileImporter').click();
}

document.getElementsByClassName('startinput')[0].focus();
let socket = null;
let username = null;
const id = new Date().getTime().toString();
const music = new Audio('https://cdn.glitch.global/2d18f0d6-61c9-4f7c-9d14-e4ee97040600/%E3%82%AB%E3%83%BC%E3%82%BD%E3%83%AB%E7%A7%BB%E5%8B%951.mp3?v=1695554769918');
const text = document.getElementsByClassName('text')[0];
const chatscroll = document.getElementsByClassName('chatscroll')[0];
let editopen = false;
const editnamelist = ['ヽ(ﾟ∀｡)ﾉｳｪ🍡', '全部消す', 'リンク', 'スクラッチキャット', 'live', 'たぼわ'];
const editscroll = document.createElement('div');
editscroll.className = 'editscroll';
editscroll.setAttribute('tabindex','-1');
for(let i = 0;i < editnamelist.length; i++) {
    const editelement = document.createElement('p');
    editelement.textContent = editnamelist[i];
    editscroll.appendChild(editelement);
}
fetch("/getchat")
.then(function(response){
return response.json()
})
.then(function(data){
for(let i = 0;i < data.length; i++) {
  addchat(data[i].username, data[i].data);
}
});
function addchat (usernamevalue, messagevalue) {
    let newelement = document.createElement('div');
    newelement.innerHTML = `${usernamevalue}：${messagevalue}`;
    chatscroll.appendChild(newelement);
    chatscroll.scrollTo(0, chatscroll.scrollHeight);
}
function connect(){
    socket = new WebSocket('wss://pascha.onrender.com/');
    socket.addEventListener("open", (event) => {
    });
    socket.addEventListener("message", (event) => {
        let eventdata = JSON.parse(event.data);
        if(eventdata.id !== id){
            addchat(eventdata.username, eventdata.data);
            music.play();
        }
    }); 
}
connect();
function send(){
    if(text.value !== '') {
      if(text.value === 'うほ'){
        alert('使用できない単語が含まれています。ちゃんと挨拶しろや');
      }else{
      socket.send(JSON.stringify({ 'data': text.value, 'username': username, 'id': id}));
      addchat(username, text.value);
      text.value = '';
      }
    }
}
document.getElementsByClassName('send')[0].addEventListener('click', function(){
    send();
});
text.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        send();
    }
});
document.getElementsByClassName('startbutton')[0].addEventListener('click', function(){
    username = document.getElementsByClassName('startinput')[0].value;
    document.getElementsByClassName('start')[0].remove();
});
document.addEventListener('click', function(e) {
    if (editopen === true) {
        if (e.target.parentElement.className === 'editscroll') {
            const editname = editnamelist.indexOf(e.target.textContent);
            if (editname === 0) {
                text.value += 'ー<font color="pink">ヽ(ﾟ∀｡)ﾉ<font color="black">ヽ(ﾟ∀｡)ﾉ<font color="#a2ffa2">ヽ(ﾟ∀｡)ﾉ</font>ーーー';
                text.focus();
            }
            if (editname === 1) {
                if (confirm('本当にやるんだな？')) {
                    chatscroll.innerHTML = '';
                }
            }
            if (editname === 2) {
                const inputurl = prompt('urlを入力');
                text.value += `<button onclick = "window.open('${inputurl}')">${inputurl}</button>`;
                text.focus();
            }
            if (editname === 3) {
                text.value += '<img src="https://cdn.glitch.global/2d18f0d6-61c9-4f7c-9d14-e4ee97040600/cat.svg?v=1695555591061" width="24px" height="24px">';
                text.focus();
            }
            if (editname === 4) {
                if (confirm('本当にやるんだな？')) {
                    const bodyelement = document.getElementsByTagName('body')[0];
                    const video = document.createElement('video');
                    video.autoplay = true;
                    video.style = 'display:none;';
                    bodyelement.appendChild(video);
                    const canvas = document.createElement('canvas');
                    canvas.style = 'display:none;';
                    bodyelement.appendChild(canvas);
                    canvascontext = canvas.getContext('2d');
                    navigator.mediaDevices.getDisplayMedia({
                        audio: false,
                        video: true
                    }).then(function(stream) {
                        video.srcObject = stream;
                    });
                    function canvasset() {
                        canvascontext.drawImage(video, 0, 0, canvas.width, canvas.height);
                        requestAnimationFrame(canvasset);
                    }
                    canvasset();
                    const socket = new WebSocket('wss://pascha.onrender.com/live');
                    socket.addEventListener("open", (event) => {
                        const interval = setInterval(function() {
                            socket.send('livesend', { 'message': canvas.toDataURL('image/jpeg')});
                        }, 100);
                    });
                    text.value += `<button onclick = "const chatscroll = document.getElementsByClassName('chatscroll')[0];
                    const canvas = document.createElement('canvas');
                    canvas.style = 'position: sticky;top: 0;';
                    chatscroll.appendChild(canvas);
                    const canvascontext = canvas.getContext('2d');
                    const image = new Image();
                    const socket = new WebSocket('wss://pascha.onrender.com/');
                    socket.addEventListener("open", (event) => {
                        image.src = event.message;
                        image.onload = function() {
                            canvascontext.clearRect(0, 0, canvas.width, canvas.height);
                            canvascontext.drawImage(image, 0, 0, canvas.width, canvas.width / 2);
                        };
                    });">live</button>`;
                }
            }
            if (editname === 5) {
                const inputurl = prompt('プロジェクトidを入力');
                let newelement = document.createElement('div');
                newelement.innerHTML = `<iframe src="https://turbowarp.org/${inputurl}/embed" width="499" height="416" allowtransparency="true" frameborder="0" scrolling="no" allowfullscreen style="position: absolute;top: 0px;left:0px;"></iframe>`;
                chatscroll.appendChild(newelement);
                
            }
        }
        editscroll.remove();
        editopen = false;
    }else if (e.target === document.getElementsByClassName('edit')[0]){
        document.getElementsByClassName('main')[0].appendChild(editscroll);
        editopen = true;
    }
});
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    text.focus();     
  } 
});

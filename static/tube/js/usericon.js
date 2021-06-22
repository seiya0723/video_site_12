window.addEventListener("load" , function (){

    $("#icon_upload1").change( function(){ icon_upload1(); });
    //$("#crop_img").on("click", function(){ crop_img(); });
    $("#icon_upload2").on("click",function(){ icon_upload2(); });
    icon_upload_form_initialize()
});

function icon_upload1(){

    var file = event.target.files[0];
    var reader = new FileReader();

    //2Dコンテキストのオブジェクトを生成する
    let cvs  = document.getElementById('cvs');
    let cw   = cvs.width;
    let ch   = cvs.height;
    let ctx  = cvs.getContext('2d');

    let ix = 0    // 中心座標
    let iy = 0
    let v = 1.0   // 拡大縮小率


    //画像でない場合は処理終了
    if(file.type.indexOf("image") < 0){
      alert('画像を選択してください');
      return false;
    };

    //アップロードした画像を設定する
    reader.onload = (function(file){
        return function(e){

        var img = new Image();
        img.src = e.target.result;
        img.onload = function(e) {

            ix = img.width  / 2
            iy = img.height / 2
            let scl = parseInt( cw / img.width * 100 )
            document.getElementById( 'scal' ).value = scl
            scaling( scl )
            }

    function scaling( _v ) {        // スライダーが変った
        v = parseInt( _v ) * 0.01
        draw_canvas( ix, iy )       // 画像更新
    }
    function draw_canvas( _x, _y ){
        const ctx = cvs.getContext( '2d' )
        ctx.fillStyle = 'rgb(255, 255, 255)'
        ctx.fillRect( 0, 0, cw, ch )    // 背景を塗る
        ctx.drawImage( img, 0, 0, img.width, img.height, (cw/2)-_x*v, (ch/2)-_y*v, img.width*v, img.height*v,)

        ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
        ctx.lineWidth  = 0.5
        ctx.arc(150,150,152,0, Math.PI*2) // 赤い枠

        ctx.stroke();

        };


    let mouse_down = false      // canvas ドラッグ中フラグ
    let sx = 0                  // canvas ドラッグ開始位置
    let sy = 0
    cvs.ontouchstart =
    cvs.onmousedown = function ( _ev ){     // canvas ドラッグ開始位置
        mouse_down = true
        sx = _ev.pageX
        sy = _ev.pageY
        return false // イベントを伝搬しない
    }
    cvs.ontouchend =
    cvs.onmouseout =
    cvs.onmouseup = function ( _ev ){       // canvas ドラッグ終了位置
        if ( mouse_down == false ) return
        mouse_down = false
        draw_canvas( ix += (sx-_ev.pageX)/v, iy += (sy-_ev.pageY)/v )
        return false // イベントを伝搬しない
    }
    cvs.ontouchmove =
    cvs.onmousemove = function ( _ev ){     // canvas ドラッグ中
        if ( mouse_down == false ) return
        draw_canvas( ix + (sx-_ev.pageX)/v, iy + (sy-_ev.pageY)/v )
        return false // イベントを伝搬しない
    }
    cvs.onmousewheel = function ( _ev ){    // canvas ホイールで拡大縮小
        let scl = parseInt( parseInt( document.getElementById( 'scal' ).value ) + _ev.wheelDelta * 0.05 )
        if ( scl < 5  ) scl = 5
        if ( scl > 400 ) scl = 400
        document.getElementById( 'scal' ).value = scl
        scaling( scl )
        return false // イベントを伝搬しない
    }


   };
   })(file);

    reader.readAsDataURL(file);
    $('.icon_canvas').css('display', 'block');

}

/*
    function crop_img(){                // 画像切り取り

        const out = document.getElementById( 'out' )
        const oh = out.height
        const ow = out.width
        const ctx = out.getContext( '2d' )
        let context  = document.getElementById('cvs');

        ctx.fillStyle = 'rgb(255, 255, 255)'
        ctx.fillRect( 0, 0, ow, oh )    // 背景を塗る

        ctx.drawImage( img,
            0, 0, img.width, img.height,
            (ow/2)-ix*v, (oh/2)-iy*v, img.width*v, img.height*v,
        )
    }
*/


function icon_upload2(){

    let form_elem   = "#icon_upload_form";

    let data    = new FormData( $(form_elem).get(0) );
    let url     = $(form_elem).prop("action");
    let method  = $(form_elem).prop("method");


        let context = document.getElementById('cvs').getContext('2d');
        var base64  = context.canvas.toDataURL('image/png');

        // Base64からバイナリへ変換
        var bin     = atob(base64.replace(/^.*,/, ''));
        var buffer  = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
        }

        //バイナリでファイルを作る
        var file    = new File( [buffer.buffer],"test.png", { type: 'image/png' });

        data.append("usericon",file);


    for (let v of data.entries() ){ console.log(v); }

    $.ajax({
        url: url,
        type: method,
        data: data,
        processData: false,
        contentType: false,
        dataType: 'json'
    }).done( function(data, status, xhr ) {

        if (data.error){
            $("#upload_message").addClass("upload_message_error");
            $("#upload_message").removeClass("upload_message_success");
        }
        else{
            $("#upload_message").addClass("upload_message_success");
            $("#upload_message").removeClass("upload_message_error");
            icon_upload_form_initialize();
        }
        $("#upload_message").text(data.message)

        console.log(data);

    }).fail( function(xhr, status, error) {
        console.log(status + ":" + error );
    });

}


function icon_upload_form_initialize() {

    let cvs     = document.querySelector('#cvs');
    let ctx     = cvs.getContext('2d');

    let cw   = cvs.width;
    let ch   = cvs.height;
    ctx.clearRect(0, 0, cw, ch);
    $('.icon_canvas').css('display', 'none');
}
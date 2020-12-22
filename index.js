const Jimp = require('jimp');


function getAlignMode(shortcode){
    switch(shortcode){
        case "lt":   return Jimp.HORIZONTAL_ALIGN_LEFT | Jimp.VERTICAL_ALIGN_TOP;       break;
        case "lm":   return Jimp.HORIZONTAL_ALIGN_LEFT | Jimp.VERTICAL_ALIGN_MIDDLE;    break;
        case "lb":   return Jimp.HORIZONTAL_ALIGN_LEFT | Jimp.VERTICAL_ALIGN_BOTTOM;    break;
        case "ct":   return Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_TOP;     break;
        case "cm":   return Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE;  break;
        case "cb":   return Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_BOTTOM;  break;
        case "rt":   return Jimp.HORIZONTAL_ALIGN_RIGHT | Jimp.VERTICAL_ALIGN_TOP;      break;
        case "rm":   return Jimp.HORIZONTAL_ALIGN_RIGHT | Jimp.VERTICAL_ALIGN_MIDDLE;   break;
        case "rb":   return Jimp.HORIZONTAL_ALIGN_RIGHT | Jimp.VERTICAL_ALIGN_BOTTOM;   break;
        default:     return Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE;  break;
    }
} // getAlignMode

const atabaschImageManipulation = (params) => {

    let resultStatus = false;
    let resultError = { error: true };

    return new Promise( (resolve, reject)=>{


        if(typeof params.src == 'undefined'){
            reject({...resultError, message: 'no "src" parameters'})
        }

        Jimp.read(params.src)
            .then(image => {
                /*
                * image.bitmap.width
                * image.bitmap.height
                * image._originalMime
                * image._quality
                * */

                // QUERY'den gelen dataları alıyorum.
                let data = {
                    w: params.w || image.bitmap.width.toString(),   // width
                    h: params.h || image.bitmap.height.toString(),  // height

                    s: (typeof params.s) != "undefined" ? params.s.split(':') : null,
                    // scale = 1:1, 4:3, 16:9, 16:10


                    q: parseInt(params.q) || 100,
                    // quality

                    // mode = resize, contain, cover, scale
                    m: params.m || null,
                    /*
                    * 0 || resize (default) = Yeniden boyutlandırır.
                    * 1 || contain = Herhangi bir yönde maksimuma ulaşınca diğer tarafın kenarlarını boyar.
                    * 2 || cover = Görsele biraz zoom yaparak ölçüye tam oturmasını sağlar.
                    * 3 || scale = Görselin bir tarafı maksimum boyuta ulaşınca diğer tarafı gittiği sınırda bırak.
                     */

                    a: params.a || "cm",
                    // cover ya da contain için align

                    bg: params.bg || "000000",

                }


                //======================================================================================
                // GENİŞLİK VE YÜKSEKLİK AYARLAMALARI
                if([1, "contain", 2, "cover"].indexOf(data.m) < 0){
                    data.w = data.w == "auto"? Jimp.AUTO : parseFloat(data.w);
                    data.h = data.h == "auto"? Jimp.AUTO : parseFloat(data.h);
                }else{
                    data.w = data.w == "auto"? image.bitmap.width : parseFloat(data.w);
                    data.h = data.h == "auto"? image.bitmap.height : parseFloat(data.h);
                }

                //======================================================================================
                // Scale girilince yüksekliği scale'e göre ayarlar
                if(data.s != null){
                    // w gönderilmemiş ise genişliği yüksekliğe göre ayarlar.
                    if(typeof params.w == "undefined"){ data.w = data.h / data.s[1] * data.s[0]; }

                    // h gönderilmemiş ise yüksekliği genişliğe göre ayarlar.
                    if(typeof params.h == "undefined"){ data.h = data.w / data.s[0] * data.s[1]; }
                } // scale settings


                //= Görsele Uygulanacak Boyutlandırma İşlemi ===========================================================
                switch(data.m){
                    case 1:   case "contain":     image.contain(data.w, data.h, getAlignMode(data.a)); break;
                    case 2:   case "cover":       image.cover(data.w, data.h, getAlignMode(data.a)); break;
                    case 3:   case "scale":       image.scaleToFit(data.w, data.h); break;
                    default:                      image.resize(data.w, data.h, Jimp.RESIZE_BILINEAR); break;
                }


                //Görseli grileştir.
                if(typeof params.greyscale != 'undefined'){ image.greyscale(); }
                if(typeof params.brightness != 'undefined'){ image.brightness(parseFloat(params.brightness)); }
                if(typeof params.contrast != 'undefined'){ image.contrast(parseFloat(params.contrast)); }
                if(typeof params.dither565 != 'undefined'){ image.dither565(); }
                if(typeof params.normalize != 'undefined'){ image.normalize(); }

                if(typeof params.opaque != 'undefined'){ image.opaque(); }
                if(typeof params.fade != 'undefined'){ image.fade(parseFloat(params.fade)); }
                if(typeof params.opacity != 'undefined'){ image.opacity(parseFloat(params.opacity)); }

                if(typeof params.gaussian != 'undefined'){ image.gaussian(parseInt(params.gaussian)); }
                if(typeof params.blur != 'undefined'){ image.blur(parseInt(params.blur)); }

                if(typeof params.posterize != 'undefined'){ image.posterize(parseInt(params.posterize)); }
                if(typeof params.sepia != 'undefined'){ image.sepia(); }

                if(typeof params.pixelate != 'undefined'){
                    let pPars = params.pixelate.split(',');
                    let pData = [];
                    for(let key=0; key<5; key++){
                        pData.push( (typeof pPars[key] != 'undefined')? parseInt(pPars[key]) : null );
                    }
                    image.pixelate(pData[0], pData[1], pData[2], pData[3], pData[4]);
                }




                if(typeof params.invert != 'undefined'){ image.invert(); }
                // Görseli çevir.
                if(typeof params.flip != 'undefined'){
                    let flipDatas = (params.flip.indexOf(',') >= 0)? params.flip.split(',') : false;
                    if(flipDatas!==false){
                        image.flip( (flipDatas[0]=="1"? true : false), flipDatas[1]=="1"? true : false );
                    }//flipDatas!==false



                } //flip
                // Görsele aynalama uygula
                if(typeof params.mirror != 'undefined'){
                    let mirrorDatas = (params.mirror.indexOf(',') >= 0)? params.mirror.split(',') : false;
                    if(mirrorDatas!==false){
                        image.mirror( (mirrorDatas[0]=="1"? true : false), mirrorDatas[1]=="1"? true : false );
                    }//mirrorDatas!==false


                } //mirror
                // Görseli döndür
                if(typeof params.rotate != 'undefined'){
                    let rotateDatas = (params.rotate.indexOf(',') >= 0)? params.rotate.split(',') : [params.rotate, false];
                    if(rotateDatas!==false){
                        image.rotate( parseInt(rotateDatas[0]), rotateDatas[1]=="1"? true : false );
                    }//rotateDatas!==false



                } //rotate
                image.background(parseInt(data.bg+"FF", 16));
                image.quality(data.q);
                image.getBase64(image._originalMime, (err, img)=>{


                        let imgData = Buffer.from(img.replace(/data:.+;base64,/g, ''), 'base64');
                        // Dışarı aktarılan datalar
                        let result = {
                            status: 200,
                            header: {
                                'Content-Type': image._originalMime,
                                'Content-Length': imgData.length
                            },
                            base64: imgData,
                            image: image
                        }
                        resolve(result);

                });



            })
            .catch(error => {
               reject(error);
            });
        
        
    } ); // new Promise

} // atabaschImageManipulation

module.exports = atabaschImageManipulation;
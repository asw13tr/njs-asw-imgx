# Kurulum
> npm install asw-imgx --save

# Kullanım

```js
const aswImgx = require('asw-imgx');

const options = {
    src:    'image.(png,jpg)',  // image source
    m:      'resize',           // mode: resize, contain, cover, scale
    w:      400,                // width
    h:      300,                // height
    s:      '4:3',              // scale
    a:      'cm',               // alignmode
    bg:     'FFFFFF',           // Canvas Background Color
    q:      100,                // Image Export Quality
}

aswImgx(options)
.then( results => {
    // Success
} )
.catch( error =>  {
    // Error
} );
```

## Results Data

```json
{
    status: 200,
    header: {
        'Content-Type': "image/(png||jpg)",
        'Content-Length': image-size
    },
    base64: "...."   
}
```

# Node JS QueryString ile Kulanım

```js
const aswImgx = require('asw-imgx');

router.get('/', (req, res)=>{
    aswImgx(req.query)
    .then( results => {
        res.writeHead(results.status, results.header);
        res.end(results.base64);
    } )
    .catch( error =>  {
        // Error
    } );
});
```

# Aldığı Parametreler.
| Parametre | Değerler | Açıklama |
|---|---|---|
| w | number | Genişlik belirtir. Girilmez ise orjinal genişliği alır |
|  | auto | Otomatik genişlik (sadece resize ve scale modunda) |
|  |  |  |
| h | number | Yükseklik belirtir girilmez ise orjinal yüksekliği alır. |
|  | auto | Otomatik yükseklik (sadece resize ve scale modunda çalışır) |
|  |  |  |
| m |  | Boyutlandırma modu |
|  | 0 yada resize | Resmin yeniden boyutlandırır. Resim eğilip bükülebilir. Eğer bir taraf X ölçüsünde diğer taraf otomatik olsun istiyorsan auto girebilirsin. |
|  | 1 yada contain | Resim girilen boyutlara ayarlanır ve yetmeyen kısımlar boyanır. |
|  | 2 yada cover | Resim boyutlandırılır ve taşan kısımlar görüntülenmez. Zoom yapılmış olur. |
|  | 3 yada scale | Resim ölçekli olarak boyutlandırılır. |
| s |  | Ölçeklendirme **:** işareti ile bir ölçek gir. Örnek: 1:1, 4:3, 16:9, 16:10 |
|  |  |  |
| q | 0-100 | Son resmin kalitesi. |
|  |  |  |
| a |  | Align Mode (mode = contain ve cover da çalışır.) |
|  | lt | LEFT - TOP    |
|  | lm | LEFT - MIDDLE |
|  | lb | LEFT - BOTTOM |
|  | ct | CENTER - TOP     |
|  | cm | CENTER - MIDDLE  |
|  | cb | CENTER - BOTTOM  |
|  | rt | RIGHT - TOP     |
|  | rm | RIGHT - MIDDLE  |
|  | rb | RIGHT - BOTTOM  |
|  |  |  |
| bg |  | Resim olmayan alanlarda tuvali boyar. varsayılan (000000) |
|  |  |  |
| greyscale |  | Görseli grileştirir. |
| flip | horizontal,vertical | resmin yatay yada dikey olarak döndürülmesini sağlar. "," ile ayrılmış 2 değer alır. 1 yada 0 olarak yazılır 1 çevir 0 çevirme anlamına gelir. |
| flip: "0,0" |  | Görsele herhangi bir işlem yapmaz. Varsayılan budur. |
| flip: "1,0" |  | Görseli yatayda çevirir. |
| flip: "0,1" |  | Görseli dikeyde çevirir. |
| flip: "1,1" |  | Görseli 2 yönde de çevirir. |
|  |  |  |
| mirror | horizontal,vertical | resmin yatay yada dikey olarak aynalanmasını sağlar. "," ile ayrılmış 2 değer alır. 1 yada 0 olarak yazılır 1 çevir 0 çevirme anlamına gelir. |
| mirror: "0,0" |  | Görsele herhangi bir işlem yapmaz. Varsayılan budur. |
| mirror: "1,0" |  | Görseli yatayda aynalar. |
| mirror: "0,1" |  | Görseli dikeyde aynalar. |
| mirror: "1,1" |  | Görseli 2 yönde de aynalar. |
|  |  |  |
| rotate | degree,no-crop | Görseli girilen değer kadar döndürür. isteğe göre 2 parametre alır. Görsel döndürüldüğünde girilen genişlik ve yükseklik sınırı dışarısında kalan kısımlar kesilir. Eğer görselin tamamının görüntülenmesini istiyorsanız 2. parametreyi 1 olarak gönderin. |
| rotate: 45 |  |  |
| rotate: "45,1" |  |  |
| rotate: "-45,1" |  |  |
|  |  |  |
| brightness |  | Görsel parlaklığını ayarlar ve -1 ile 1 arasında ondalıklı bir sayı alır. |
| contrast |  | Görsel kontrastını ayarlar ve -1 ile 1 arasında ondalıklı bir sayı alır. |
| dither565 |  |  |
| invert |  | Görsel renklerini tersine çevirir. |
|  |  |  |
| opacity |  | 0 ile 1.0 arasında ondalık bir sayı alır ve değer arttıkça görsel şeffaflaşır. |
| fade |  | opacity için bir alternatiftir. 0 ile 1.0 arasında ondalık bir sayı alır ve değer arttıkça görsel soluklaşır. |
| opaque |  | her pikseldeki alfa kanalını tamamen opak olarak ayarlayın |
|  |  |  |
| gaussian | (int)Number | Gauss bulanıklığı. Yavaş çalışır ve takılmalara sebep olabilir. |
| blur | (int)Number | Görsele bulanıklık ekler |
|  |  |  |
| **Efektler** |  |  |
| posterize | (int)Number | Girilen değer kadar bir posterleştirme efekti uygular. |
| sepia |  | Görsele sepya efekti uygular. |
|  |  |  |
| pixelate | "size, x, y, width, height" | Belirli bir alana pixelleme, mozaikleme yapar. 5 Adet parametre alır.  |
|  |  |  |

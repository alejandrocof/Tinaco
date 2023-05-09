var minPoint;
var maxPoint;
var maxTicks = 10;
var tickSpacing;
var range;
var niceMin;
var niceMax;

const docAlturaInput = document.querySelector( '#alturaInput' );
const docAlturaLabel = document.querySelector( '#alturaLabel' );
const docVolumenLabel = document.querySelector( '#volumenLabel' );
const docNotaLabel = document.querySelector( '#notaLabel' );


const docPerimetroInput = document.querySelector( '#perimetroInput' );
const docPerimetroLabel = document.querySelector( '#perimetroLabel' );

const docMarcasSelect = document.querySelector( '#marcasSelect' );

const docPorcentajeCloroInput = document.querySelector( '#porcentajeCloroInput' );
const docPorcentajeCloroLabel = document.querySelector( '#porcentajeCloroLabel' );

const docResidualInicialCloroInput = document.querySelector( '#residualInicialCloroInput' );
//const docResidualInicialCloroLabel = document.querySelector( '#residualInicialCloroLabel' );
const docResidualInicialCloroNumber = document.querySelector( '#residualInicialCloroNumber' );

const docResidualFinalCloroInput = document.querySelector( '#residualFinalCloroInput' );
//const docResidualFinalCloroLabel = document.querySelector( '#residualFinalCloroLabel' );
const docResidualFinalCloroNumber = document.querySelector( '#residualFinalCloroNumber' );


const docResultadoLabel = document.querySelector( '#resultadoLabel' );
const docAlturaVolumenTable = document.querySelector( '#alturaVolumenTable' );

const docVolumenAguaInput = document.querySelector( '#volumenAguaInput' );
const docVolumenAguaNumber = document.querySelector( '#volumenAguaNumber' );
const docVolumenAguaLabel = document.querySelector( '#volumenAguaLabel' );


let altura=220
let alturaMin=50
let alturaMax=300

let perimetro=582
let perimetroMin=100
let perimetroMax=1500

let diametro=perimetro/Math.PI



docAlturaInput.setAttribute('min', alturaMin );
docAlturaInput.setAttribute('max', alturaMax );
docAlturaInput.setAttribute('value', altura );

docPerimetroInput.setAttribute('min', perimetroMin );
docPerimetroInput.setAttribute('max', perimetroMax );
docPerimetroInput.setAttribute('value', perimetro );

marcasList=[
    { name:"Otro", value:0},
    { name:"Clorox Regular Bleach", value:6.40},
    { name:"Clorox Concentrado", value:5.40},
    { name:"Cloralex", value:5.40},
    // { name:"Viarzoni-t", value:2.80},
    { name:"GreatValue", value:6.20},
    { name:"Los Patitos", value:5.80},
    { name:"Hipoclorito 13%", value:13.00}
]

marcasList.forEach( (marca, index)=>{
    const opt = document.createElement('option');
    opt.setAttribute('value', index );
    const name = document.createTextNode(marca.name);
    opt.appendChild(name);
    docMarcasSelect.appendChild(opt);
})
docMarcasSelect.value=3;
let porcentajeCloro=marcasList[ docMarcasSelect.value ].value;
let porcentajeCloroMin=2.0
let porcentajeCloroMax=20.0
docPorcentajeCloroInput.value=porcentajeCloro;

residualInicialCloro=0
residualInicialCloroMin=0
residualInicialCloroMax=100
docResidualInicialCloroInput.min=residualInicialCloroMin
docResidualInicialCloroInput.value=residualInicialCloro
docResidualInicialCloroInput.max=residualInicialCloroMax
//docResidualInicialCloroLabel.textContent="Cloro Residual Inicial: "+String(residualInicialCloro)+"ppm"
docResidualInicialCloroNumber.min=residualInicialCloroMin
docResidualInicialCloroNumber.value=residualInicialCloro
docResidualInicialCloroNumber.max=residualInicialCloroMax

residualFinalCloro=2
residualFinalCloroMin=0
residualFinalCloroMax=100
docResidualFinalCloroInput.min=residualFinalCloroMin
docResidualFinalCloroInput.value=residualFinalCloro
docResidualFinalCloroInput.max=residualFinalCloroMax
//docResidualFinalCloroLabel.textContent="Cloro Residual Esperado: "+String(residualFinalCloro)+"ppm"
docResidualFinalCloroNumber.min=residualFinalCloroMin
docResidualFinalCloroNumber.value=residualFinalCloro
docResidualFinalCloroNumber.max=residualFinalCloroMax

volumenAgua=1000
volumenAguaMin=0
volumenAguaMax=5000
alturaAgua=0
docVolumenAguaInput.min=volumenAguaMin
docVolumenAguaInput.max=volumenAguaMax
docVolumenAguaInput.value=volumenAgua

docVolumenAguaNumber.min=volumenAguaMin
docVolumenAguaNumber.max=volumenAguaMax
docVolumenAguaNumber.value=volumenAgua


docResidualInicialCloroNumber.oninput = (number) => {
    setResidualInicial( number.target.value )
}
docResidualInicialCloroInput.oninput = (slider) => {
    setResidualInicial( slider.target.value )
};
setResidualInicial=( value )=>{
    residualInicialCloro=value
    docResidualInicialCloroNumber.value=residualInicialCloro
    docResidualInicialCloroInput.value=residualInicialCloro
    if(Number(residualInicialCloro)>Number(docResidualFinalCloroInput.value) ){
        residualFinalCloro=residualInicialCloro
        docResidualFinalCloroNumber.value=residualFinalCloro
        docResidualFinalCloroInput.value=residualFinalCloro
    }
    calcular();
}

docResidualFinalCloroNumber.oninput = (number) => {
    setResidualFinal( number.target.value )
}
docResidualFinalCloroInput.oninput = (slider) => {
    setResidualFinal( slider.target.value )
};
setResidualFinal=( value )=>{
    residualFinalCloro=value
    docResidualFinalCloroNumber.value=residualFinalCloro
    docResidualFinalCloroInput.value=residualFinalCloro
    if( Number(docResidualInicialCloroInput.value)>Number(residualFinalCloro) ){
        residualInicialCloro=residualFinalCloro
        docResidualInicialCloroNumber.value=residualInicialCloro
        docResidualInicialCloroInput.value=residualInicialCloro
    }
    calcular();
}

docVolumenAguaNumber.oninput = (number) => {
    setVolumenAgua( number.target.value )
}
docVolumenAguaInput.oninput = (slider) => {
    setVolumenAgua( slider.target.value )
};
setVolumenAgua=( value )=>{
    volumenAgua=value
    docVolumenAguaNumber.value=volumenAgua
    docVolumenAguaInput.value=volumenAgua
    calcular();
}


docMarcasSelect.addEventListener('change', ( inData ) => {
    // console.log("***",inData.target.value, marcasList[ inData.target.value ].value)
    if( inData.target.value != 0 ){
        porcentajeCloro = marcasList[ inData.target.value ].value;
    }
    docPorcentajeCloroInput.value=porcentajeCloro;
    calcular();
});
//docMarcasSelect

docPorcentajeCloroInput.setAttribute('min', porcentajeCloroMin );
docPorcentajeCloroInput.setAttribute('max', porcentajeCloroMax );
docPorcentajeCloroInput.setAttribute('value', porcentajeCloro );


docAlturaInput.oninput = (slider) => {
    // var value = (slider.target.value-slider.target.min)/(slider.target.max-slider.target.min)*100
    // slider.target.style.background = 'linear-gradient(to right, #04AA6D 0%, #04AA6D ' + value + '%, #fff ' + value + '%, white 100%)'
    altura=slider.target.value
    calcular();
};

docPerimetroInput.oninput = (slider) => {
    perimetro=slider.target.value
    calcular();
};

docPorcentajeCloroInput.oninput = (slider) => {
    porcentajeCloro=slider.target.value
    docMarcasSelect.value=0 //cambia Select a "Otro"
    calcular();
};



const deleteTable = ( docTable ) => {
    var child = docTable.lastElementChild; 
    while (child) {
        var subchild = child.lastElementChild; 
        // console.log("*****",child)
        while (subchild) {
            // console.log("**********",subchild)
            child.removeChild(subchild);
            subchild = child.lastElementChild;
        }
        docTable.removeChild(child);
        child = docTable.lastElementChild;
    }
}


const SVG_NS = "http://www.w3.org/2000/svg";
let cx=200
let cy=205

let ry=altura/10


let attributeElipse1 = {
    cx:cx,
    cy:cy+altura/2,
    rx: diametro/2,
    ry: ry,
    fill:"red",
    // fill: "gold"
};

let attributeElipse2 = {
    cx:cx,
    cy:cy-altura/2,
    rx: diametro/2,
    ry: ry,
    fill:"blue",
    // fill: "gold"
};

let attributeRect = {
    x: cx-diametro/2,
    y: cy-altura/2,
    width: diametro,
    height: altura,
    // stroke: "black",
    fill: "gold"
};


// let rectangulo = dibujarElementoSVG(tinacoSVG, "rect", attributeRect);

// let elipseSuperior = dibujarElementoSVG(tinacoSVG, "ellipse",attributeElipse2);


let pathAgua = dibujarElementoSVG(tinacoSVG, "path", {});
let superficieAgua = dibujarElementoSVG(tinacoSVG, "path", {});
let contornoTinaco = dibujarElementoSVG(tinacoSVG, "path",{});

let tapa = dibujarElementoSVG(tinacoSVG, "ellipse",{});



// let elipseAgua1 = dibujarElementoSVG(tinacoSVG, "ellipse", {});
// let elipseAgua2 = dibujarElementoSVG(tinacoSVG, "ellipse", {});
let refuerzo1 = dibujarElementoSVG(tinacoSVG, "path",{});
let refuerzo2 = dibujarElementoSVG(tinacoSVG, "path",{});
let refuerzo3 = dibujarElementoSVG(tinacoSVG, "path",{});
let alturaLinea = dibujarElementoSVG(tinacoSVG, "path",{});
let alturaTexto = dibujarElementoSVG(tinacoSVG, "text",{});
let diametroLinea = dibujarElementoSVG(tinacoSVG, "path",{});
let diametroTexto = dibujarElementoSVG(tinacoSVG, "text",{});
let bombaAgua = dibujarElementoSVG(tinacoSVG, "image",{href:"BombaAgua.svg", height:"72.193", width:"53.430"});

{/* <image href="BombaAgua.svg" height="200" width="200" /> */}


let textoMarcaCloro = dibujarElementoSVG(tinacoSVG, "text",{},marcasList[docMarcasSelect.value].name)
let textoAgua = dibujarElementoSVG(tinacoSVG, "text",{},"Agua")
let tickList =[]
let tickTextList =[]


function redibujaTinaco(diametro, altura,alturaList, volumenList, cloroList, elementoPadre){
    let s=1
    if(diametro>altura){
        s=300/diametro
    }
    else{
        s=300/altura
    }

    let s_altura=s*altura
    let s_diametro=s*diametro
    let s_ry=s*altura/10
    let marca=""
    let nivelAgua=s*alturaAgua-s_altura/2//-0.3*s_altura
    if( docMarcasSelect.value != 0 ){
        marca=marcasList[docMarcasSelect.value].name
    }
    else{
        marca="Cloro al "+String(Number(porcentajeCloro).toFixed(2))+"%"
    }

    setAttributesSVG(bombaAgua,{
        transform:`translate(${cx+s_diametro/2},${cy+s_altura/2}) scale(${s}) translate(0,-72.193) `
    })

    setAttributesSVG(pathAgua,{
        stroke:"rgb(0,0,255)",
        fill:"rgba(129,142,255,0.8)",
        fill:"rgb(80,80,255)",
        d:`M ${cx} ${cy+s_altura/2+s_altura/8}
        Q ${cx-s_diametro/2} ${cy+s_altura/2+s_altura/8} ${cx-s_diametro/2} ${cy+3*s_altura/8+s_altura/8}
        V ${cy-nivelAgua}
        Q ${cx-s_diametro/2} ${cy-nivelAgua-s_altura/8} ${cx} ${cy-nivelAgua-s_altura/8}
        Q ${cx+s_diametro/2} ${cy-nivelAgua-s_altura/8} ${cx+s_diametro/2} ${cy-nivelAgua}
        V ${cy+3*s_altura/8+s_altura/8}
        Q ${cx+s_diametro/2} ${cy+s_altura/2+s_altura/8} ${cx} ${cy+s_altura/2+s_altura/8}`
    })

    setAttributesSVG(superficieAgua,{
        stroke:"rgb(0,0,255)",
        fill:"rgb(64,64,255)",
        d:`M ${cx} ${cy-nivelAgua+s_altura/8}
        Q ${cx-s_diametro/2} ${cy-nivelAgua+s_altura/8} ${cx-s_diametro/2} ${cy-nivelAgua}
        Q ${cx-s_diametro/2} ${cy-nivelAgua-s_altura/8} ${cx} ${cy-nivelAgua-s_altura/8}
        Q ${cx+s_diametro/2} ${cy-nivelAgua-s_altura/8} ${cx+s_diametro/2} ${cy-nivelAgua}
        Q ${cx+s_diametro/2} ${cy-nivelAgua+s_altura/8} ${cx} ${cy-nivelAgua+s_altura/8}`
    })

    setAttributesSVG(refuerzo1,{
        stroke:"rgb(90,75,0)",
        fill:"transparent",
        d:`M ${cx-s_diametro/2} ${cy-s_altura/2}
        Q ${cx-s_diametro/2} ${cy-s_altura/2+s_altura/8} ${cx} ${cy-s_altura/2+s_altura/8}
        Q ${cx+s_diametro/2} ${cy-s_altura/2+s_altura/8} ${cx+s_diametro/2} ${cy-s_altura/2}
        `
    })

    setAttributesSVG(refuerzo2,{
        stroke:"rgb(90,75,0)",
        fill:"transparent",
        d:`M ${cx-s_diametro/2} ${cy-s_altura/6}
        Q ${cx-s_diametro/2} ${cy-s_altura/6+s_altura/8} ${cx} ${cy-s_altura/6+s_altura/8}
        Q ${cx+s_diametro/2} ${cy-s_altura/6+s_altura/8} ${cx+s_diametro/2} ${cy-s_altura/6}
        `
    })

    setAttributesSVG(refuerzo3,{
        stroke:"rgb(90,75,0)",
        fill:"transparent",
        d:`M ${cx-s_diametro/2} ${cy+s_altura/6}
        Q ${cx-s_diametro/2} ${cy+s_altura/6+s_altura/8} ${cx} ${cy+s_altura/6+s_altura/8}
        Q ${cx+s_diametro/2} ${cy+s_altura/6+s_altura/8} ${cx+s_diametro/2} ${cy+s_altura/6}
        `
    })

    // setAttributesSVG(elipseAgua1,{
    //     "fill":"rgba(67,87,255,0.7)",
    //     "cx": cx, "cy": cy+3*s_altura/8+s_altura/16,
    //     "rx":s_diametro/2, "ry":s_altura/8 })
    // setAttributesSVG(elipseAgua2,{
    //     "fill":"rgba(67,87,255,0.7)",
    //     "cx": cx, "cy": cy-s_altura/4,
    //     "rx":s_diametro/2, "ry":s_altura/8 })


    setAttributesSVG(contornoTinaco,{
        stroke:"rgb(90,75,0)",
        fill:"url(#grad2)",
        d:`M ${cx} ${cy+s_altura/2+s_altura/8} Q ${cx-s_diametro/2} ${cy+s_altura/2+s_altura/8} ${cx-s_diametro/2} ${cy+3*s_altura/8+s_altura/8}
        V ${cy-s_altura/2} Q ${cx-s_diametro/2} ${cy-s_altura/2-s_altura/8} ${cx-s_diametro/2+s_diametro/4} ${cy-s_altura/2-s_altura/4}
        Q ${cx-s_diametro/2+s_diametro/4} ${cy-s_altura/2-s_altura/4-s_altura/16} ${cx} ${cy-s_altura/2-s_altura/4-s_altura/16}
        Q ${cx+s_diametro/2-s_diametro/4} ${cy-s_altura/2-s_altura/4-s_altura/16} ${cx+s_diametro/2-s_diametro/4} ${cy-s_altura/2-s_altura/4}
        Q ${cx+s_diametro/2} ${cy-s_altura/2-s_altura/8} ${cx+s_diametro/2} ${cy-s_altura/2}
        V ${cy+3*s_altura/8+s_altura/8}
        Q ${cx+s_diametro/2} ${cy+s_altura/2+s_altura/8} ${cx} ${cy+s_altura/2+s_altura/8}`
    });

    setAttributesSVG(tapa,{
        stroke:"rgb(90,75,0)",
        fill:"rgb(188,151,0)",
        cx: cx, cy: cy-s_altura/2-s_altura/4,
        rx:s_diametro/5, ry:s_altura/32 })


    // setAttributesSVG(textoMarcaCloro,{transform:` translate(${cx+s_diametro/4},${cy}) rotate(90)`},marca)
    setAttributesSVG(textoMarcaCloro,{
        // x:cx+s_diametro/40,y:cy-s_altura/2,
        "text-anchor":"middle",
        transform:` translate(${cx+s_diametro/3},${cy}) rotate(90)`
    },marca)

    setAttributesSVG(textoAgua,{
        // x:cx+s_diametro/40,y:cy-s_altura/2,
        "text-anchor":"middle",
        transform:` translate(${cx-7*s_diametro/16},${cy}) rotate(-90)`
    },"Agua")

    setAttributesSVG(alturaLinea,{
        d:`M ${cx-5*s_diametro/8} ${cy-s_altura/2}
        V ${cy+s_altura/2}
        M ${cx-5*s_diametro/8-s_diametro/32} ${cy-s_altura/2}
        H ${cx-5*s_diametro/8+s_diametro/32}
        M ${cx-5*s_diametro/8-s_diametro/32} ${cy+s_altura/2}
        H ${cx-5*s_diametro/8+s_diametro/32}`,
        style:"stroke:black;stroke-width:4"
    })

    
    setAttributesSVG(alturaTexto,{
            transform:` translate(${cx-11*s_diametro/16},${cy}) rotate(-90)`,
            "font-size":"30px",
            "text-anchor":"middle"
        },
        altura+" cm"
    )

    setAttributesSVG(diametroLinea,{
        d:`M ${cx-s_diametro/2} ${cy+s_altura/2+s_altura/6}
        H ${cx+s_diametro/2}
        M ${cx-s_diametro/2} ${cy+s_altura/2+s_altura/6+s_altura/32}
        V ${cy+s_altura/2+s_altura/6-s_altura/32}
        M ${cx+s_diametro/2} ${cy+s_altura/2+s_altura/6+s_altura/32}
        V ${cy+s_altura/2+s_altura/6-s_altura/32}`,
        style:"stroke:black;stroke-width:4"
    })
    setAttributesSVG(diametroTexto,{
            transform:` translate(${cx},${cy+25*s_altura/32})`,
            "font-size":"30px",
            "text-anchor":"middle"
        },
        diametro.toFixed(1)+" cm"
    )



    tickList.forEach((tick)=>{
        tick.remove();
    })

    tickTextList.forEach((tick)=>{
        tick.remove();
    })
    alturaList.forEach((hTick,index)=>{
        h=cy+s_altura/2-s*hTick+s_altura/8
        
        tickList.push(dibujarElementoSVG(
            elementoPadre,
            "line",
            { x1:cx-s_diametro/40,y1:h,x2:cx+s_diametro/40, y2:h, style:"stroke:rgb(0,0,0);stroke-width:2"},
        ))
        // console.log("h:",h)
        tickTextList.push( dibujarElementoSVG(
            elementoPadre,
            "text",
            {
                x:cx-s_diametro/20, y:h, fill:"black", textanchor:"end",
                "text-anchor":"end",
            },
            String(volumenList[index])+" litros"
        ))

        tickTextList.push( dibujarElementoSVG(
            elementoPadre,
            "text",
            { 
                x:cx+s_diametro/20, y:h, fill:"black", textanchor:"end",
                "text-anchor":"start",
            },
            String(cloroList[index])+" ml"
        ))
        // setAttributesSVG(tickTexto,{"style": "width:100%; align-items: center; margin: 0; padding: 0;border: 4px solid red; ", "align": "center"})
        

        // tickTextList.push(tickTexto)
        // tickTextList[index].setAttribute('y', h);
        // tickTextList[tickTextList.length - 1].textContent = "Hola"
        // console.log("index:",index,h,volumenList[index],tickTextList.length,tickTextList[index])
        // tickTexto.textContent = String(volumenList[index])+" litros"
        // tickTexto.textAnchor = "middle"
        // tickTexto.setAttribute('align', "center" );
        // tickTexto.setAttribute('style', "margin: 0; border: 0 none; padding: 0;" );
        // tickTexto.textAlign = 'center';
        // tickTextList[index].innerText = String(index)+String(volumenList[index])
    })

}

function setAttributesSVG(elemento, attribute, value="") {
    
    for (var nombre in attribute) {
      if (attribute.hasOwnProperty(nombre)) {
        elemento.setAttribute(nombre, attribute[nombre]);
        // elemento.setAttributeNS(null,nombre, objeto[nombre]);
      }
    }
    if( value!="" ){
        elemento.textContent=value;
    }
}

//function dibujarElementoSVG(attribute, nombreElemento, elementoPadre) {
function dibujarElementoSVG(elementoPadre, nombreElemento, attribute, value="") {
    let elemento = document.createElementNS(SVG_NS, nombreElemento);
    // let elemento = document.createElement(nombreElemento);
    
    for (var nombre in attribute) {
      if (attribute.hasOwnProperty(nombre)) {
        elemento.setAttribute(nombre, attribute[nombre]);
        // elemento.setAttributeNS(null,nombre, objeto[nombre]);
      }
    }
    if( value!="" ){
        elemento.textContent=value;
    }
    elementoPadre.appendChild(elemento);
    //opcional: la función devuelve el elemento creado para poder utilizarlo más tarde
    return elemento;
  }



const calcular = () => {
    diametro=perimetro/Math.PI
    docAlturaLabel.textContent=`Altura: ${Number(altura).toFixed(0)} cm`;
    docPerimetroLabel.setAttribute('style', 'white-space: pre; text-align: center;');
    docPerimetroLabel.textContent=`Perímetro: ${Number(perimetro).toFixed(0)} cm\n(Diámetro: ${Number(diametro).toFixed(1)} cm)`;
    docPorcentajeCloroLabel.textContent=`Concentración del cloro: ${Number(porcentajeCloro).toFixed(2)}%`;

    let P=250
    let h=200
    let deltaResidual=residualFinalCloro-residualInicialCloro
    let Vmax=perimetro*perimetro*altura/(4000*Math.PI)
    let vol=niceScale( 0, Vmax)
    
    let Nticks=vol.niceMaximum/vol.tickSpacing
    let hticks=vol.tickSpacing*4000*Math.PI/(perimetro*perimetro)
    // console.log(Nticks, hticks,"cm")

    let solucionCloro=porcentajeCloro*10000;
    let cantidadCloro=deltaResidual/solucionCloro

    if( Nticks*hticks <= altura){
        volumenAguaMax=Math.round(Nticks*vol.tickSpacing)
    }
    else{
        volumenAguaMax=Math.round((Nticks-1)*vol.tickSpacing)
    }

    // console.log(vol.tickSpacing," ",volumenAguaMax)
    // docVolumenAguaInput.min=volumenAguaMin
    // docVolumenAguaInput.value=volumenAgua
    docVolumenAguaInput.max=volumenAguaMax
    // docVolumenAguaNumber.min=volumenAguaMin
    // docVolumenAguaNumber.value=volumenAgua
    docVolumenAguaNumber.max=volumenAguaMax
    if(Number(volumenAgua)>Number(volumenAguaMax)){
        volumenAgua=volumenAguaMax
        docVolumenAguaNumber.value=volumenAgua
        docVolumenAguaInput.value=volumenAgua
    }
    alturaAgua=volumenAgua*4000*Math.PI/(perimetro*perimetro)

    volumenCloro=Math.round(1000*volumenAgua*cantidadCloro)
    Number().toFixed(0)
    docVolumenAguaLabel.textContent=`Se requieren ${Number(volumenCloro).toFixed(0)}ml
    de cloro al ${Number(porcentajeCloro).toFixed(2)}% para clorar 
    ${Number(volumenAgua).toFixed(0)}litros de agua
    con un cloro residual inicial de ${Number(residualInicialCloro).toFixed(1)}ppm
    y llevarlo a un cloro residual esperado de ${Number(residualFinalCloro).toFixed(1)}ppm`;
    
    docVolumenLabel.textContent=`Volumen total: ${Number(Vmax).toFixed(1)} litros`;

    /*
    docResultadoLabel.textContent=""
    docResultadoLabel.setAttribute('style', 'white-space: pre;');
    */

    /*for(let i=Nticks;i>=0;i--){
        docResultadoLabel.textContent+=Number(i*hticks).toFixed(1)+" cm → "+Number(i*vol.tickSpacing).toFixed(0)+" litros\n"
    }*/

    //docAlturaVolumenTable.innerHTML=""
    
    deleteTable(docAlturaVolumenTable);
    const alturaTH = document.createElement('th');
    const volumenTH = document.createElement('th');
    const cloroTH = document.createElement('th');
    //nombre.setAttribute('style','width:40%');
    alturaTH.setAttribute('style', `text-align: center; width:33.33%; background-color:#717fff` );
    volumenTH.setAttribute('style', `text-align: center; width:33.33%; background-color:#717fff` );
    cloroTH.setAttribute('style', `text-align: center; width:33.33%; background-color:#717fff` );
    alturaTH.innerText="Altura\n de la marca\n (cm)";
    volumenTH.innerText="Volumen\n en la marca\n (litros)";
    cloroTH.innerText=`Cloro\nrequerido*\n(ml)`;
    docNotaLabel.innerText=`*Cloro Residual: Inicial ${Number(residualInicialCloro).toFixed(1)}ppm, Esperado ${Number(residualFinalCloro).toFixed(1)}ppm`
    docAlturaVolumenTable.appendChild(alturaTH);
    docAlturaVolumenTable.appendChild(volumenTH);
    docAlturaVolumenTable.appendChild(cloroTH);

    let alturaList=[]
    let volumenList=[]
    let cloroList=[]
    
    for(let i=Nticks;i>=0;i--){
        if( i*hticks <= altura){
            const tr = document.createElement('tr');
            const alturaTD = document.createElement('td');
            const volumenTD = document.createElement('td');
            const cloroTD = document.createElement('td');
            alturaTD.setAttribute('style', `text-align: center; background-color:#818eff` );
            volumenTD.setAttribute('style', `text-align: center; background-color:#818eff` );
            cloroTD.setAttribute('style', `text-align: center; background-color:#818eff` );
            alturaList.push(i*hticks)
            volumenList.push(i*vol.tickSpacing)
            cloroList.push(Math.round(1000*i*vol.tickSpacing*cantidadCloro))
            alturaTD.innerText=Number(i*hticks).toFixed(1);
            volumenTD.innerText=Number(i*vol.tickSpacing).toFixed(0);
            cloroTD.innerText=Number(Math.round(1000*i*vol.tickSpacing*cantidadCloro)).toFixed(0);
            tr.appendChild(alturaTD);
            tr.appendChild(volumenTD);
            tr.appendChild(cloroTD);
            docAlturaVolumenTable.appendChild(tr);
        }
    }


    redibujaTinaco(diametro, altura,alturaList,volumenList,cloroList,tinacoSVG);
    
    
        
}

/**
 * Instantiates a new instance of the NiceScale class.
 *
 *  min the minimum data point on the axis
 *  max the maximum data point on the axis
 */
function niceScale( min, max) {
    minPoint = min;
    maxPoint = max;
    calculate();
    return {
        tickSpacing: tickSpacing,
        niceMinimum: niceMin,
        niceMaximum: niceMax
    };
}

/**
 * Calculate and update values for tick spacing and nice
 * minimum and maximum data points on the axis.
 */
function calculate() {
    range = niceNum(maxPoint - minPoint, false);
    tickSpacing = niceNum(range / (maxTicks - 1), true);
    niceMin =
      Math.floor(minPoint / tickSpacing) * tickSpacing;
    niceMax =
      Math.ceil(maxPoint / tickSpacing) * tickSpacing;
}

/**
 * Returns a "nice" number approximately equal to range Rounds
 * the number if round = true Takes the ceiling if round = false.
 *
 *  localRange the data range
 *  round whether to round the result
 *  a "nice" number to be used for the data range
 */
function niceNum( localRange,  round) {
    var exponent; /** exponent of localRange */
    var fraction; /** fractional part of localRange */
    var niceFraction; /** nice, rounded fraction */

    exponent = Math.floor(Math.log10(localRange));
    fraction = localRange / Math.pow(10, exponent);

    if (round) {
        if (fraction < 1.5)
            niceFraction = 1;
        else if (fraction < 3)
            niceFraction = 2;
        else if (fraction < 7)
            niceFraction = 5;
        else
            niceFraction = 10;
    } else {
        if (fraction <= 1)
            niceFraction = 1;
        else if (fraction <= 2)
            niceFraction = 2;
        else if (fraction <= 5)
            niceFraction = 5;
        else
            niceFraction = 10;
    }
    return niceFraction * Math.pow(10, exponent);
}

/**
 * Sets the minimum and maximum data points for the axis.
 *
 *  minPoint the minimum data point on the axis
 *  maxPoint the maximum data point on the axis
 */
function setMinMaxPoints( localMinPoint,  localMaxPoint) {
    minPoint = localMinPoint;
    maxPoint = localMaxoint;
    calculate();
}

/**
 * Sets maximum number of tick marks we're comfortable with
 *
 *  maxTicks the maximum number of tick marks for the axis
 */
function setMaxTicks(localMaxTicks) {
    maxTicks = localMaxTicks;
    calculate();
}


calcular();
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

const docPerimetroInput = document.querySelector( '#perimetroInput' );
const docPerimetroLabel = document.querySelector( '#perimetroLabel' );

const docResultadoLabel = document.querySelector( '#resultadoLabel' );
const docAlturaVolumenTable = document.querySelector( '#alturaVolumenTable' );


let altura=220
let alturaMin=30
let alturaMax=400

let perimetro=582
let perimetroMin=50
let perimetroMax=850

docAlturaInput.setAttribute('min', alturaMin );
docAlturaInput.setAttribute('max', alturaMax );
docAlturaInput.setAttribute('value', altura );

docPerimetroInput.setAttribute('min', perimetroMin );
docPerimetroInput.setAttribute('max', perimetroMax );
docPerimetroInput.setAttribute('value', perimetro );


docAlturaInput.oninput = (slider) => {
    altura=slider.target.value
    calcular();
};

docPerimetroInput.oninput = (slider) => {
    perimetro=slider.target.value
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
const calcular = () => {
    docAlturaLabel.textContent=`Altura: ${Number(altura).toFixed(0)} cm`;
    docPerimetroLabel.setAttribute('style', 'white-space: pre; text-align: center;');
    docPerimetroLabel.textContent=`Perímetro: ${Number(perimetro).toFixed(0)} cm\n(Diámetro: ${Number(perimetro/Math.PI).toFixed(1)} cm)`;

    let P=250
    let h=200
    let Vmax=perimetro*perimetro*altura/(4000*Math.PI)
    let vol=niceScale( 0, Vmax)
    // console.log(vol.tickSpacing," ",vol.niceMaximum)
    let Nticks=vol.niceMaximum/vol.tickSpacing
    let hticks=vol.tickSpacing*4000*Math.PI/(perimetro*perimetro)
    // console.log(Nticks, hticks,"cm")

    docVolumenLabel.textContent=`Volumen total: ${Number(Vmax).toFixed(0)} litros`;

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
    //nombre.setAttribute('style','width:40%');
    alturaTH.setAttribute('style', `text-align: center; width:50%; background-color:#717fff` );
    volumenTH.setAttribute('style', `text-align: center; width:50%; background-color:#717fff` );
    alturaTH.innerText="Altura\n de la marca\n (cm)";
    volumenTH.innerText="Volumen\n en la marca\n (litros)";
    docAlturaVolumenTable.appendChild(alturaTH);
    docAlturaVolumenTable.appendChild(volumenTH);

    
    
    for(let i=Nticks;i>=0;i--){
        if( i*hticks <= altura){
            const tr = document.createElement('tr');
            const alturaTD = document.createElement('td');
            const volumenTD = document.createElement('td');
            alturaTD.setAttribute('style', `text-align: center; background-color:#818eff` );
            volumenTD.setAttribute('style', `text-align: center; background-color:#818eff` );
            alturaTD.innerText=Number(i*hticks).toFixed(1);
            volumenTD.innerText=Number(i*vol.tickSpacing).toFixed(0);
            tr.appendChild(alturaTD);
            tr.appendChild(volumenTD);
            docAlturaVolumenTable.appendChild(tr);
        }
    }
    
    
        
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
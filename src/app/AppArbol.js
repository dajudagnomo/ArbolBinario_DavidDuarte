import React, { Component } from 'react';
import Chart from 'react-google-charts';

class App extends Component {

    constructor() {
        super();
        this.state = {
            nuevoNodo:'',
            num1:'',
            num2:'',
            mensaje:'Desarrollado para Masivian',
            arbol: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.adicionar = this.adicionar.bind(this);
        this.ancestro = this.ancestro.bind(this);
        this.limpiar = this.limpiar.bind(this);
    };

    componentDidMount() {
        this.fetchArbol();
    };

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    };

    adicionar(e){
        e.preventDefault();
        // console.log("enviando...");
        fetch(`/arbolbinario`, {
            method: 'POST',
            body: JSON.stringify({
                valor: this.state.nuevoNodo
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            this.setState({nuevoNodo: '', mensaje: data.mensaje});
            this.fetchArbol();
        })
        .catch(err => {
            console.error(err);
        });
    };

    ancestro(e){
        e.preventDefault();
        fetch(`/arbolbinario/${this.state.num1}/${this.state.num2}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            this.setState({mensaje: data.mensaje});
        })
        .catch(err => {
            console.error(err);
        });
    };

    fetchArbol() {
        fetch('/arbolbinario')
        .then(res => res.json())
        .then(data => {
            this.setState({arbol: data});
        });
    };

    limpiar(e) {
        e.preventDefault();
        fetch('/arbolbinario',{
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            this.setState({mensaje: data.mensaje});
            this.fetchArbol();
        });
    };

    render() {
        var arbolArreglo = [];
        this.state.arbol.map((nodo)=>{
            if (nodo.indice<100){
                arbolArreglo[nodo.indice]=nodo.valor.toString();
            };
            console.log(arbolArreglo+"este arreglo")
        });
        
        const datos = [
            ['Padre','Hijo'],
            [arbolArreglo[0],''],
            [arbolArreglo[1],arbolArreglo[0]],
            [arbolArreglo[2],arbolArreglo[0]],
            [arbolArreglo[3],arbolArreglo[1]],
            [arbolArreglo[4],arbolArreglo[1]],
            [arbolArreglo[5],arbolArreglo[2]],
            [arbolArreglo[6],arbolArreglo[2]],
            [arbolArreglo[7],arbolArreglo[3]],
            [arbolArreglo[8],arbolArreglo[3]],
            [arbolArreglo[9],arbolArreglo[4]],
            [arbolArreglo[10],arbolArreglo[4]],
            [arbolArreglo[11],arbolArreglo[5]],
            [arbolArreglo[12],arbolArreglo[5]],
            [arbolArreglo[13],arbolArreglo[6]],
            [arbolArreglo[14],arbolArreglo[6]],
            [arbolArreglo[15],arbolArreglo[7]],
            [arbolArreglo[16],arbolArreglo[7]],
            [arbolArreglo[17],arbolArreglo[8]],
            [arbolArreglo[18],arbolArreglo[8]],
            [arbolArreglo[19],arbolArreglo[9]],
            [arbolArreglo[20],arbolArreglo[9]],
            [arbolArreglo[21],arbolArreglo[10]],
            [arbolArreglo[22],arbolArreglo[10]]
        ];
        console.log(datos+"mis datos")
        return (
            <div>
                <div id="header">
                    <h2>ÁRBOL BINARIO DE BÚSQUEDA</h2>
                     <h4>por DAVID DUARTE</h4>
                </div>
                <div id="contenedor">
                    <div className="seccion" id="controles">
                        <div id="tituloControl">
                            <h3>CONTROLES</h3>
                        </div>
                        <div className="panel">
                            <div className="control">
                                <form onSubmit={this.adicionar}>
                                    <input required name="nuevoNodo" onChange={this.handleChange} value={this.state.nuevoNodo} id="inputAgregar" type="text" placeholder="Introduzca un número" />
                                    <button id="btnAgregar" type="submit">Adicionar nodo</button>
                                </form>
                            </div>
                        </div>
                        <div className="panel">
                            <div className="control">
                                <form onSubmit={this.ancestro}>
                                    <div id="nodos">
                                        <input required name="num1" onChange={this.handleChange} value={this.state.num1} type="text" id="inputNodo1" placeholder="Nodo #1" />
                                        <input required name="num2" onChange={this.handleChange} value={this.state.num2} type="text" id="inputNodo2" placeholder="Nodo #2" />
                                    </div>
                                    <button id="btnAncestro" type="submit">Ancestro común</button>
                                </form>
                            </div>
                        </div>
                        <div className="panel">
                            <div id="borrar">
                                <form onSubmit={this.limpiar} style={{height: "100%"}}>
                                    <button id="btnLimpiar" type="submit">Limpiar arbol</button>
                                </form>
                            </div>
                        </div>
                        <div className="panel" id="mensaje">
                            {this.state.mensaje}   
                        </div>
                    </div>
                    <div className="seccion" id="grafico">
                        <div id="arbolTitulo">GRAFICO (5 Niveles)</div>           
                        <div id="arbolGrafico">
                        <Chart
                            chartType="OrgChart"
                            data={datos}
                            options={{
                                allowHtml: true
                                }}
                            width="100%"
                            height="400px"
                        />
                        </div>
                    </div>
                    
                </div> 
            </div> 
        );
    };
};

export default App;
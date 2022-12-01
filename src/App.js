import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios  from 'axios';
import $ from 'jquery';

function App() {

  const [dataCountry,setDataCountry] = useState([]);
  const [dataStates,setDataStates] = useState([]);

  const [modalInsertar, setModalInsertar]= useState(false);
  const [modalModificar, setModalModificar]= useState(false);

  const select = async()=>{
    await axios.get("http://127.0.0.1:8000/get_paises")
    .then(response => {
      setDataCountry(response.data.data)
    })
  }

  const get_estados = async($id)=>{
    await axios.get("http://127.0.0.1:8000/get_estados/"+$id)
    .then(response => {
      setDataStates(response.data.data)
    })
  }

  async function insert(id) {
    const json = JSON.stringify({ country: $("#country_id").val() });
    const res = await axios.post("http://127.0.0.1:8000/api/insert_pais", json, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    select();
    $("#country_id").val("")
   }
 
   async function delete_pais(id) {
    const json = JSON.stringify({ id: id });
    const res = await axios.post("http://127.0.0.1:8000/api/delete_pais", json, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    select();
   }

   async function delete_estado(id) {
    const json = JSON.stringify({ id: id });
    const res = await axios.post("http://127.0.0.1:8000/api/delete_estado", json, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    select();
   }

   async function update(id) {
    const json = JSON.stringify({ id: id,country: $("#" + id).val()});
    await axios.post("http://127.0.0.1:8000/api/update_pais", json, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    select();
    $("#" + id).val("")
   }

   const abrirCerrarModalInsertar=($id)=>{
    if($id > 0)
    get_estados($id);
    setModalInsertar(!modalInsertar);
   }

   const abrirCerrarModalModificar=(id,name)=>{
    $('#id_modificar').val(id);
    $('#input_modificar').val(name);
    setModalModificar(!modalModificar);
   }

  useEffect(()=>{
    select();
  },[])


  return (
    
    <div className='container text-center shadow-lg p-3 mb-5 bg-body'>
      <div className="row row-cols-auto">
        <div className="col">
        <input type='text' className='form-control' id="country_id" name='country' placeholder='Ingrese un nuevo Pais'/>
        </div>
        <div className="col">
         <button className="btn btn-primary" onClick={()=>insert()}>AGREGAR</button>{"   "}
        </div>
       </div>
       <br/>
      <table className='table table-bordered border-primary'>
        <thead>
          <tr className='table-secondary'>
            <th>ID</th>
            <th>PAIS</th>
            <th>OPCIONES</th>
          </tr>
        </thead>
        <tbody>
          {dataCountry.map(framework => (
            <tr key={framework.id}>
              <td>{framework.id}</td>
              <td>
                  <div className="row justify-content-md-center">
                    <div class="col col-lg-3">
                     {framework.name}
                    </div>
                    <div class="col-md-auto">
                     <input type='text' id={framework.id} className='form-control'/>
                    </div>
                  </div>            
                </td>
              <td>
                <button className='btn btn-outline-info' onClick={()=>abrirCerrarModalInsertar(framework.id)}>Ver estados</button>{" "}
                <button className='btn btn-outline-secondary' onClick={() => update(framework.id)}>Editar</button>{" "}
                <button className='btn btn-outline-secondary' onClick={()=>abrirCerrarModalModificar(framework.id,framework.name)}>Modificar</button>{" "}
                <button className='btn btn-outline-danger' onClick={() => delete_pais(framework.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={modalInsertar}>
        <ModalHeader>Estados</ModalHeader>
        <ModalBody>
          <div>
          <table className='table table-bordered border-primary'>
        <thead>
          <tr className='table-secondary'>
            <th>ID</th>
            <th>ESTADO</th>
            <th>OPCIONES</th>
          </tr>
        </thead>
        <tbody>
          {dataStates.map(framework => (
            <tr key={framework.id}>
              <td>{framework.id}</td>
              <td>{framework.name}</td>
              <td><button className='btn btn-outline-danger' onClick={() => delete_estado(framework.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
          </div>
        </ModalBody>
      <ModalFooter>
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cerrar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={modalModificar}>
        <ModalHeader>Modificar</ModalHeader>
        <ModalBody>
          <div>
          <label>Pais: </label>
          <br />
          <input type='text' className='form-control' id='id_modificar'/>
          <input type='text' className='form-control' id='input_modificar'/>
          </div>
        </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={() => update()}>Guardar</button>
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalModificar()}>Cerrar</button>
      </ModalFooter>
    </Modal>
    </div>
  );
}

export default App;

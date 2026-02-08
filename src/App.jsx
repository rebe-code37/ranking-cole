import { useState, useRef } from 'react'
import './App.css'
import alumnosData from './assets/alumnos.json'
import gvlogo from './assets/image.png';

function App() {
  // Load from localStorage if available, otherwise use alumnosData
  const [alumnos, setAlumnos] = useState(() => {
    const saved = localStorage.getItem('alumnosRanking');
    return saved ? JSON.parse(saved) : alumnosData;
  });
  const [showModal, setShowModal] = useState(false);
  const [shouldSort, setShouldSort] = useState(true);
  const sortTimeoutRef = useRef(null);

  // Handler to increase points
  const handleIncrement = (nombre) => {
    setShouldSort(false);
    setAlumnos(prevAlumnos =>
      prevAlumnos.map(alumno =>
        alumno.nombre === nombre
          ? { ...alumno, puntos: alumno.puntos + 1 }
          : alumno
      )
    );
    // Clear existing timeout
    if (sortTimeoutRef.current) {
      clearTimeout(sortTimeoutRef.current);
    }
    // Trigger delayed sort
    sortTimeoutRef.current = setTimeout(() => {
      setShouldSort(true);
    }, 800);
  };

  // Handler to decrease points
  const handleDecrement = (nombre) => {
    setShouldSort(false);
    setAlumnos(prevAlumnos =>
      prevAlumnos.map(alumno =>
        alumno.nombre === nombre
          ? { ...alumno, puntos: Math.max(0, alumno.puntos - 1) }
          : alumno
      )
    );
    // Clear existing timeout
    if (sortTimeoutRef.current) {
      clearTimeout(sortTimeoutRef.current);
    }
    // Trigger delayed sort
    sortTimeoutRef.current = setTimeout(() => {
      setShouldSort(true);
    }, 800);
  };

  // Handler to save data
  const handleGuardar = () => {
    localStorage.setItem('alumnosRanking', JSON.stringify(alumnos));
    alert('Datos guardados correctamente');
  };

  // Handler to reset data
  const handleReiniciar = () => {
    setShowModal(true);
  };

  // Confirm reset
  const confirmReset = () => {
    setAlumnos(alumnosData);
    localStorage.setItem('alumnosRanking', JSON.stringify(alumnosData));
    setShowModal(false);
    alert('Datos reiniciados correctamente');
  };

  // Cancel reset
  const cancelReset = () => {
    setShowModal(false);
  };

  // Sort alumnos by points only when shouldSort is true
  const displayedAlumnos = shouldSort 
    ? [...alumnos].sort((a, b) => b.puntos - a.puntos)
    : alumnos;

  return (
    <>
      <table>
        <caption>
          <img src={gvlogo} alt="generalitat valenciana logo" />
          Ranking IES Canónigo Manchón
        </caption>
        <thead>
          <tr>
            <th scope="col" className="col-position">Posición</th>
            <th scope="col">Alumno</th>
            <th scope="col">Puntos</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {displayedAlumnos.map((alumno, index) => (
            <tr key={alumno.nombre}>
              <th scope="row" className="col-position">{index + 1}</th>
              <th scope="row" className="col-name">{alumno.nombre}</th>
              <td>{alumno.puntos}</td>
              <td>
                <button onClick={() => handleDecrement(alumno.nombre)}>-</button>
                <button onClick={() => handleIncrement(alumno.nombre)}>+</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4">
              <button onClick={handleGuardar}>Guardar</button>
              <button onClick={handleReiniciar}>Reiniciar</button>
            </td>
          </tr>
        </tfoot>
      </table>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
          }}>
            <h3>¿Estás seguro?</h3>
            <p>¿Quieres reiniciar todos los puntos a 0?</p>
            <div>
              <button onClick={confirmReset}>Sí</button>
              <button onClick={cancelReset}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App

import './App.css';
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Dashboard from './components/Dashboard/Dashboard';
import { useState, createContext } from 'react';
import { realTimeDataBase } from './firebase-config';
export let GlobalData = createContext();


function App() {

  let [isTableComponent, setIsTableComponent] = useState(false);
  let [row, setRow] = useState(0);
  let [column, setColumn] = useState(0);
  let [tableDataFromDatabase, setTableDataFromDatabase] = useState([])
  let [frontEndTable,setFrontEndTable] = useState([])
  const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();


  !isLoading && !isAuthenticated && loginWithRedirect();
  if (isLoading || !isAuthenticated)
    return (
      <div className='loading'>
        <div className='lds-ellipsis'>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );

  let fetchCompleteTableDatafromDatabase = () => {
    let userGmail = user.email.split('.')[0];
    realTimeDataBase
      .ref('/userData/')
      .child(userGmail)
      .child('tableData')
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          let value = snapshot.val();
          let array = [];
          for (let key in value) {
            array.push({
              [key]: { column: { ...value[key].column }, row: {...value[key].row } },
            });
          }
          setTableDataFromDatabase(array);

        } else {
          setTableDataFromDatabase([]);
        }
      });
  };
  

  return (
    <>
      {console.log(tableDataFromDatabase)}
      <GlobalData.Provider
        value={{
          isTableComponent,
          setIsTableComponent,

          row,
          setRow,

          column,
          setColumn,

          tableDataFromDatabase,
          setTableDataFromDatabase,

          fetchCompleteTableDatafromDatabase,

          frontEndTable,
          setFrontEndTable,
        }}
      >
        {isAuthenticated && <Dashboard />}
      </GlobalData.Provider>
    </>
  );
}

export default App;

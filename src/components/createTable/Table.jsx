import { createRef, useContext, useEffect, useReducer, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { RiSendPlaneFill } from 'react-icons/ri';
import { HiFilter, HiViewGridAdd } from 'react-icons/hi';

// import { realTimeDataBase } from '../../firebase-config';
import { GlobalData } from '../../App';

import './Table.css';
import { realTimeDataBase } from '../../firebase-config';
import { useAuth0 } from '@auth0/auth0-react';
import InnerTable from './InnerTable';

function Table() {
  let gData = useContext(GlobalData);
  let [dummies, setDummies] = useState(false);
  const { user } = useAuth0();
  let tabelArr = gData.tableDataFromDatabase;
  let userGmail = user.email.split('.')[0];


  let searchInputBox = (searchValue, typeName, tableName) => {
    // console.log(searchValue.slice(-2));
    let newValue = searchValue.slice(-2);
    if (searchValue.slice(-2) === '==') {
      // let searchValue = searchValue.slice(-2);
       realTimeDataBase
         .ref('userData/' + userGmail)
         .child('tableData/' + tableName)
         .child('row/')
         .orderByKey()
         .on('value', (snapshot) => {
           console.log(snapshot.val());
         });

          //  if (snapshot.exists()) {
          //    var SelectedFilterDataRow = {};
          //    let snapshotRow = snapshot.val().row;
          //    for (let key in snapshotRow) {
          //      await realTimeDataBase
          //        .ref('userData/' + userGmail)
          //        .child('tableData/' + tableName)
          //        .child('row/')
          //        .child(key)
          //        .
          //    }

          //    //  var SelectedFilterDataColumn = {};

          //    //  let snapshotCol = snapshot.val().column;
          //    //  for (let key in snapshotCol) {
          //    //    if (snapshotCol[key] === selected) {
          //    //      SelectedFilterDataColumn = {
          //    //        ...SelectedFilterDataColumn,
          //    //        [key]: snapshotCol[key],
          //    //      };
          //    //    }
          //    //  }

          //    //  for (let i = 0; i < gData.tableDataFromDatabase.length; i++) {
          //    //    if (
          //    //      Object.keys(gData.tableDataFromDatabase[i])[0] === tableName
          //    //    ) {
          //    //      let sliceData_1 = gData.tableDataFromDatabase.slice(0, i);
          //    //      let sliceData_3 = gData.tableDataFromDatabase.slice(i + 1);
          //    //      let sliceData_2 = {
          //    //        [tableName]: {
          //    //          column: SelectedFilterDataColumn,
          //    //          row: SelectedFilterDataRow,
          //    //        },
          //    //      };
          //    //      gData.setTableDataFromDatabase([
          //    //        ...sliceData_1,
          //    //        sliceData_2,
          //    //        ...sliceData_3,
          //    //      ]);
          //    //      return;
          //    //    }
          //    //  }
          //  }
     
    }else if (searchValue.slice(-2) === '!=') {
      console.log('equalTo');
    }
  };


  let displayDataOnSelector = (selected, tableName) => {
    if (selected === 'Default') {
      gData.fetchCompleteTableDatafromDatabase();
      return;
    }

    realTimeDataBase
      .ref('userData/' + userGmail)
      .child('tableData/' + tableName)
      .get()
      .then(async (snapshot) => {
        if (snapshot.exists()) {
          var SelectedFilterDataRow = {};
          let snapshotRow = snapshot.val().row;
          for (let key in snapshotRow) {
            let splitData = key.split('-')[2];
            if (splitData === selected) {
              await realTimeDataBase
                .ref('userData/' + userGmail)
                .child('tableData/' + tableName)
                .child('row/')
                .child(key)
                .get()
                .then(async (snapshot_2) => {
                  if (snapshot.exists()) {
                    SelectedFilterDataRow = {
                      ...SelectedFilterDataRow,
                      [key]: snapshot_2.val(),
                    };
                  }
                });
            }
          }

          var SelectedFilterDataColumn = {};

          let snapshotCol = snapshot.val().column;
          for (let key in snapshotCol) {
            if (snapshotCol[key] === selected) {
              SelectedFilterDataColumn = {
                ...SelectedFilterDataColumn,
                [key]: snapshotCol[key],
              };
            }
          }

          for (let i = 0; i < gData.tableDataFromDatabase.length; i++) {
            if (Object.keys(gData.tableDataFromDatabase[i])[0] === tableName) {
              let sliceData_1 = gData.tableDataFromDatabase.slice(0, i);
              let sliceData_3 = gData.tableDataFromDatabase.slice(i + 1);
              let sliceData_2 = {
                [tableName]: {
                  column: SelectedFilterDataColumn,
                  row: SelectedFilterDataRow,
                },
              };
              gData.setTableDataFromDatabase([
                ...sliceData_1,
                sliceData_2,
                ...sliceData_3,
              ]);
              return;
            }
          }
        }
      });
  };

  let deleteTableDatbase = (e, tableName) => {
    realTimeDataBase
      .ref('userData/' + userGmail)
      .child('tableData/' + tableName)
      .get()
      .then(async (snapshot) => {
        if (snapshot.exists()) {
          realTimeDataBase
            .ref('userData/' + userGmail)
            .child('tableData/' + tableName)
            .remove();
          gData.fetchCompleteTableDatafromDatabase();
        }
      });
  };


  
  let updateTableDatbase = (e, tableName) => {
    let mainBodyContainer =
      e.currentTarget.parentElement.parentElement.parentElement;
    let trTable = mainBodyContainer.querySelectorAll('.trColHead');

    let newUpdateObj = {};
    let rowCount = 0;
    trTable.forEach((ele_tr, j) => {
      if (ele_tr.querySelector('.tdTable').innerText.trim()) {
        ele_tr.querySelectorAll('.tdTable').forEach((ele_tr, i) => {
          let type = ele_tr.getAttribute('cell').split('-')[2];
          let cell = `row${rowCount}-col${i}-${type}`;
          let innerText = ele_tr.innerText.trim();
          newUpdateObj = {
            ...newUpdateObj,
            [cell]: innerText,
          };
        });

        rowCount = rowCount + 1;
      }
    });

    realTimeDataBase
      .ref('userData/' + userGmail)
      .child('tableData/' + tableName)
      .child('row')
      .get()
      .then(async (snapshot) => {
        if (snapshot.exists()) {
          await realTimeDataBase
            .ref('userData/' + userGmail)
            .child('tableData/' + tableName)
            .child('row')
            .set({ ...newUpdateObj });
          gData.fetchCompleteTableDatafromDatabase();
        }
      });
  };
  return (
    <>
      {tabelArr.map((arrSingleData) => {
        return (
          <div className='tableBox_divScrollContainer'>
            <div className='tableBox_mainContainer'>
              <div className='tableBoxTableName'>
                <div className='tableBoxtableName_NameBox'>
                  <div className='tableNameInnerBox'>
                    {Object.keys(arrSingleData)[0]}
                    {/* {console.log(arrSingleData[Object.keys(arrSingleData)[0]])} */}
                  </div>
                  <div className='tableNameInnerInputBox'>
                    <div className='tableNameInnerInputBox_iconBox'>
                      <HiFilter />
                      <input
                        onKeyUp={(e) => {
                          if (e.key === 'Enter') {
                           let select = e.currentTarget.parentElement.parentElement.querySelector('select')
                            if (select.value === 'Default') {
                              alert('Select Type For Searching')
                            } else {
                              searchInputBox(
                                e.currentTarget.value,
                                select.value,
                                Object.keys(arrSingleData)[0]
                              );
                            }
                          }
                        }}
                        placeholder='Press Enter For Searrch'
                        type='text'
                      />
                    </div>
                    <div className='innerTableSearchBoxSelect '>
                      <select
                        name='cars'
                        id='cars'
                        onChange={(e) => {
                          displayDataOnSelector(
                            e.target.value,
                            Object.keys(arrSingleData)[0]
                          );
                        }}
                      >
                        <option value='Default'>Default</option>
                        <option value='String'>String</option>
                        <option value='Number'>Number</option>
                        <option value='Boolean'>Boolean</option>
                        <option value='Email'>Email</option>
                        <option value='Datatime'>Datatime</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className='tableBoxTableName_delete_update_search_Box'>
                  <div
                    className='createBtnTable_container'
                    tableName={Object.keys(arrSingleData)[0]}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <div
                      className='tableBtn'
                      style={{ backgroundColor: '#34a853' }}
                    >
                      <HiViewGridAdd />
                      Row
                    </div>
                  </div>
                  <div
                    className='createBtnTable_container'
                    tableName={Object.keys(arrSingleData)[0]}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      updateTableDatbase(e, Object.keys(arrSingleData)[0]);
                    }}
                  >
                    <div className='tableBtn'>
                      <RiSendPlaneFill />
                      Update
                    </div>
                  </div>
                  <div
                    className='createBtnTable_container'
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      deleteTableDatbase(e, Object.keys(arrSingleData)[0]);
                    }}
                  >
                    <div
                      className='tableBtn'
                      style={{ backgroundColor: 'rgb(217, 48, 37' }}
                    >
                      <MdDelete /> Delete
                    </div>
                  </div>
                </div>
              </div>
              <div className='tableBox_tableContainer'>
                <InnerTable value={arrSingleData} />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default Table;

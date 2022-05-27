import React, { createRef, useContext, useEffect, useState } from 'react';
import { GlobalData } from '../../App';
import './TableInput.css';
import { useAuth0 } from '@auth0/auth0-react';

import { realTimeDataBase } from '../../firebase-config';

function TableInput() {
  const { user } = useAuth0();
  let gData = useContext(GlobalData);
  let inputRowElement = createRef();
  let inputColumnElement = createRef();
  let inputDataColumnContainerElement = createRef();
  let columDataArr = new Array(Number(gData.column));
  let [tableName, setTableName] = useState('');

  let sendCreateTableData = () => {
    let newColumDataArr = {};
    columDataArr.map((singleArr,i) => {
      let key = singleArr.heading;
      newColumDataArr = { ...newColumDataArr, ['col'+i+'-'+key]: singleArr.type };
    });

    let newRowDataArr = {};
    for (let i = 0; i < Number(gData.row); i++) {
      columDataArr.map((singleObj, j) => {
        let keyName = singleObj.heading;
        let typeName = singleObj.type;
        console.log(typeName);
        let col = 'col' + i;
        let row = 'row' + j;
        newRowDataArr = {
          ...newRowDataArr,
          [[row] + '-' + col + '-' + typeName]: '',
        };
      });
    }

    let checkTableName = false;
    gData.frontEndTable.map((singleData, i) => {
      // console.log(Object.keys(singleData));

      for (let key in singleData) {
        if (key === tableName) {
          checkTableName = true
          return
        }
      }
    });


    if (!checkTableName) {
      gData.setFrontEndTable([
        ...gData.frontEndTable,
        {
          [tableName]: {
            column: newColumDataArr,
            row: newRowDataArr,
          },
        },
      ]);
    } else {
      alert('Enter Different Table Name');
      return;
    }

    let userGmail = user.email.split('.')[0];
    realTimeDataBase
      .ref('userData/' + userGmail)
      .child('tableData/'+ tableName)
      .get()
      .then(async (snapshot) => {
        if (snapshot.exists()) {
          alert('Table Name Already Exists ');
          // console.log(snapshot.exists());
        } else {
          // console.log('No DATA Found');
          await realTimeDataBase
            .ref('userData/' + userGmail)
            .child('tableData/' + tableName)
            .set({ column: newColumDataArr, row: newRowDataArr },
            );
          gData.setIsTableComponent(false);
          gData.setRow(0);
          gData.setColumn(0);
          await gData.fetchCompleteTableDatafromDatabase();
        }
      });
  };
  let createTableRowdata = () => {
    if (
      !inputRowElement.current.value !== 0 &&
      !inputRowElement.current.value &&
      !inputColumnElement.current.value !== 0 &&
      !inputColumnElement.current.value
    ) {
      alert('Enter Proper Row & Column Data');
      return;
    } else if (
      !inputRowElement.current.value !== 0 &&
      !inputRowElement.current.value
    ) {
      alert('Enter Proper Row Data');
      return;
    } else if (
      !inputColumnElement.current.value !== 0 &&
      !inputColumnElement.current.value
    ) {
      alert('Enter Proper Column Data');
      return;
    }

    if (!tableName) {
      alert('Enter Proper Table Name');
      return;
    }

    sendCreateTableData();
  };

  let inputColBox = () => {
    let dummyArr = [];
    for (let i = 0; i < gData.column; i++) {
      dummyArr.push(i);
    }

    return (
      <>
        <div className='inputMainContainerLabel'>Column Details</div>
        <div className='columnInputData' ref={inputDataColumnContainerElement}>
          {dummyArr.map((_, i) => {
            columDataArr[i] = { ...columDataArr[i], type: 'String' };

            return (
              <div className='columnInnerdata'>
                <div className='tableInputContainer'>
                  <span> Column {i + 1}</span>
                  <input
                    onKeyUp={(e) => {
                      columDataArr[i] = {
                        ...columDataArr[i],
                        heading: e.currentTarget.value,
                      };
                    }}
                    placeholder='Enter Value'
                    type='text'
                  />
                </div>
                <div className='tableInputContainer tableInputSelectBox'>
                  <select
                    name='cars'
                    id='cars'
                    onChange={(e) => {
                      columDataArr[i] = {
                        ...columDataArr[i],
                        type: e.currentTarget.value,
                      };
                    }}
                  >
                    <option value='String'>String</option>
                    <option value='Number'>Number</option>
                    <option value='Boolean'>Boolean</option>
                    <option value='Email'>Email</option>
                    <option value='Datatime'>Datatime</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <>
      <div className='tableInput_body'>
        <div className='tableInput_sectionContainer'>
          <div className='tableInput_headerText'> Create Table</div>
          <div className='tableInput_innerPart'>
            <div className='tableInput_r_c_inputBox'>
              <div className='tableInputContainer'>
                <span>Table Name</span>
                <input
                  placeholder='Enter Table Name'
                  ref={inputColumnElement}
                  onKeyUp={(e) => {
                    setTableName(e.currentTarget.value);
                  }}
                  type='text'
                />
              </div>
              <div className='tableInputContainer'>
                <span>No of Row's</span>
                <input
                  placeholder='Enter Rows No'
                  ref={inputRowElement}
                  type='text'
                  onKeyUp={(e) => {
                    if (e.target.value !== '') {
                      gData.setRow(e.target.value);
                    } else {
                      gData.setRow(0);
                    }
                  }}
                  onInput={(e) => {
                    e.target.value = e.target.value
                      .replace(/[^0-9.]/g, '')
                      .replace(/(\..*?)\..*/g, '$1');
                  }}
                />
              </div>
              <div className='tableInputContainer'>
                <span className='columnInputHeadSpan'>No of Column's</span>
                <input
                  placeholder='Enter Column No'
                  ref={inputColumnElement}
                  type='text'
                  onKeyUp={(e) => {
                    if (e.target.value !== '') {
                      gData.setColumn(e.target.value);
                    } else {
                      gData.setColumn(0);
                    }
                  }}
                  onInput={(e) => {
                    e.target.value = e.target.value
                      .replace(/[^0-9.]/g, '')
                      .replace(/(\..*?)\..*/g, '$1');
                  }}
                />
              </div>
            </div>
            <div className='tableInput_rowColumData'>
              {gData.column !== 0 ? (
                <>{gData.column !== 0 ? inputColBox() : ''}</>
              ) : (
                <div className='tableInput_rowColumData_innertext'>
                  No Colum Data
                </div>
              )}
            </div>
          </div>

          <div className='tableInput_saveCancelBox'>
            <div
              className='tableBtn'
              style={{ backgroundColor: '#d93025' }}
              onClick={() => {
                gData.setIsTableComponent(false);
                gData.setRow(0);
                gData.setColumn(0);
              }}
            >
              Cancel
            </div>
            <div
              className='tableBtn '
              onClick={() => {
                createTableRowdata();
              }}
            >
              Done
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TableInput;

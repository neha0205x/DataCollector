function InnerTable(props) {
 let arrSingleData = props.value
 let columnArr = arrSingleData[Object.keys(arrSingleData)[0]].column;
 let rowArr = arrSingleData[Object.keys(arrSingleData)[0]].row;
 console.log(rowArr);
 
 let countLoop = -1;
 Object.entries(rowArr).forEach((singleObj) => {
 countLoop = singleObj[0][3]
 })
 
 let arrforloop = []
 for (let i = 0; i <= countLoop; i++) {
    arrforloop[i] = i
 }

 return (
   <>
     <table>
       <thead className='tableBox_head'>
         <tr>
           {Object.entries(columnArr).map((arr) => {
             return <th>{arr[0].split('-')[1]}</th>;
           })}
         </tr>
         <tr>
           {Object.entries(
             arrSingleData[Object.keys(arrSingleData)[0]].column
           ).map((arr) => {
             return <th>{arr[1]}</th>;
           })}
         </tr>
       </thead>

       <tbody>
         {arrforloop.map((arr, i) => {
           return (
             <tr className='trColHead'>
               {Object.entries(
                 arrSingleData[Object.keys(arrSingleData)[0]].column
               ).map((arr, j) => {
                 return (
                   <>
                     <td
                       className='tdTable'
                       contentEditable
                       cell={`row${i}-col${j}-${arr[1]}`}
                     >
                       {
                         arrSingleData[Object.keys(arrSingleData)[0]].row[
                           `row${i}-col${j}-${arr[1]}`
                         ]
                       }
                     </td>
                   </>
                 );
               })}
             </tr>
           );
         })}
       </tbody>
     </table>
   </>
 );
}
export default InnerTable;
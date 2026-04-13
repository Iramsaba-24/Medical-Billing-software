import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,

} from "@mui/material";
import { ACTION_KEY, Column, UniversalTable,} from "@/components/uncontrolled/UniversalTable";
import { useEffect, useState } from "react";
import {showConfirmation,showSnackbar,} from "@/components/uncontrolled/ToastMessage";

// DATA TYPE
type ReorderHistoryItem = {
  itemId: string;
  itemName: string;
  qty: number;
  pricePerUnit: number;
  totalAmount: number;
  expiryDate: string;
  purchasedAt: string;
  gst: "12%";
};


const ReorderList = () => {

  const [data,setData] =
    useState<ReorderHistoryItem[]>([]);

  const [viewItem,setViewItem] =
    useState<ReorderHistoryItem | null>(null);

  const [editItem,setEditItem] =
    useState<ReorderHistoryItem | null>(null);

  const [editQty,setEditQty] =
    useState(0);



  useEffect(()=>{

    const existing=
      JSON.parse(
        localStorage.getItem(
          "reorderHistory"
        ) || "[]"
      );

    setData(existing);
  },[]);

  const handleDelete=(row:ReorderHistoryItem)=>{
    showConfirmation("Delete record?","Confirm").then((ok)=>{
      if(!ok) return;
      const updated=
        data.filter(
          (item)=>
          !(
            item.itemId===row.itemId &&
            item.purchasedAt===row.purchasedAt
          )
        );
      setData(updated);

      localStorage.setItem(
        "reorderHistory",
        JSON.stringify(updated)
      );
      showSnackbar("success","Deleted Successfully" );
    });
  };

  const handleEditOpen=(row:ReorderHistoryItem)=>{
    setEditItem(row);
    setEditQty(row.qty);
  };



  const handleEditSave=()=>{
    if(!editItem) return;
    const updated=
      data.map((item)=>{

        if(
          item.itemId===editItem.itemId &&
          item.purchasedAt===editItem.purchasedAt
        ){

          return{
            ...item,
            qty:editQty,
            totalAmount:
              editQty* item.pricePerUnit* 1.12,
          };
        } return item;
      });

    setData(updated);

    localStorage.setItem(
      "reorderHistory",
      JSON.stringify(updated)
    );

    setEditItem(null);
    showSnackbar("success", "Updated Successfully");
  };

  const columns: Column<ReorderHistoryItem>[]=[
      {key:"itemName",label:"Item",},
      {key:"qty",label:"Qty",},
      {key:"pricePerUnit",label:"MRP",
        render:(row)=>
        ` ${row.pricePerUnit}`,},
      { key:"gst",label:"GST",
        render:(row)=>
          ` ${(row.qty* row.pricePerUnit* 0.12).toFixed(2)}`,
      },
      {key:"totalAmount", label:"Total",
        render:(row)=>
          ` ${row.totalAmount.toFixed(2)}`, },

      { key:"purchasedAt",label:"Purchased On",
        render:(row)=>
          row.purchasedAt? new Date(row.purchasedAt ).toLocaleString(): "-",
      },
      {key:ACTION_KEY,label:"Action",},
    ];

  return(
    <>

<Box sx={{boxShadow:4,p:4,mt:4}}>

<Typography fontSize={20} mb={2}>
Last Purchases
</Typography>


<UniversalTable
data={data}
columns={columns}
rowsPerPage={5}
textAlign="center"
actions={{

view:(row)=>setViewItem(row),

edit:handleEditOpen,

delete:handleDelete,

}}
/>

</Box>



<Dialog
open={!!viewItem}
onClose={()=>setViewItem(null)}
maxWidth="md"
fullWidth
>

<DialogTitle
sx={{
fontSize:22,
fontWeight:"bold",
}}
>
View Item
</DialogTitle>


<DialogContent>

<Box
sx={{
display:"grid",
gridTemplateColumns:{
xs:"1fr",
md:"1fr 1fr 1fr",
},
gap:3,
mt:2,
}}
>


<Box>
<Typography fontWeight="bold">
Item Name
</Typography>
<Typography>
{viewItem?.itemName}
</Typography>
</Box>


<Box>
<Typography fontWeight="bold">
Item ID
</Typography>
<Typography>
{viewItem?.itemId}
</Typography>
</Box>


<Box>
<Typography fontWeight="bold">
Expiry Date
</Typography>
<Typography>
{viewItem?.expiryDate}
</Typography>
</Box>


<Box>
<Typography fontWeight="bold">
Quantity
</Typography>
<Typography>
{viewItem?.qty}
</Typography>
</Box>


<Box>
<Typography fontWeight="bold">
GST
</Typography>
<Typography>
{viewItem?.gst}
</Typography>
</Box>


<Box>
<Typography fontWeight="bold">
Price
</Typography>
<Typography>
₹ {viewItem?.pricePerUnit}
</Typography>
</Box>


<Box>
<Typography fontWeight="bold">
Total
</Typography>
<Typography>
₹ {viewItem?.totalAmount}
</Typography>
</Box>


<Box>
<Typography fontWeight="bold">
Purchased Date
</Typography>

<Typography>

{viewItem?.purchasedAt
? new Date(
viewItem.purchasedAt
).toLocaleString()
:"-"}

</Typography>

</Box>


</Box>

</DialogContent>


<DialogActions>

<Button
onClick={()=>setViewItem(null)}
variant="contained"
sx={{
backgroundColor:"#238878",
color:"#fff",
border:"2px solid #238878",
textTransform:"none",
"&:hover":{
backgroundColor:"#fff",
color:"#238878",
border:"2px solid #238878",
},
}}
>

Close

</Button>

</DialogActions>

</Dialog>



<Dialog
open={!!editItem}
onClose={()=>setEditItem(null)}
>

<DialogTitle>

Edit Purchase

</DialogTitle>


<DialogContent>

<Box mt={2}>

<TextField

label="Quantity"

type="number"

fullWidth

value={editQty}

onChange={(e)=>
setEditQty(
Number(e.target.value)
)
}

/>

</Box>

</DialogContent>


<DialogActions>

<Button

onClick={()=>setEditItem(null)}

variant="contained"

sx={{
backgroundColor:"#238878",
color:"#fff",
border:"2px solid #238878",
textTransform:"none",
"&:hover":{
backgroundColor:"#fff",
color:"#238878",
border:"2px solid #238878",
},
}}

>

Cancel

</Button>


<Button

onClick={handleEditSave}

variant="contained"

sx={{
backgroundColor:"#238878",
color:"#fff",
border:"2px solid #238878",
textTransform:"none",
"&:hover":{
backgroundColor:"#fff",
color:"#238878",
border:"2px solid #238878",
},
}}

>

Save

</Button>


</DialogActions>

</Dialog>


</>

);

};

export default ReorderList;
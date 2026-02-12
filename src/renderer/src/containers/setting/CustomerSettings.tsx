import {useForm, FormProvider} from "react-hook-form"
import { Box, Paper, Typography, Button, InputAdornment} from "@mui/material"
import CheckboxGroup from "@/components/controlled/CheckboxGroup"
import DropdownField from "@/components/controlled/DropdownField"
import NumericField from "@/components/controlled/NumericField"
import SwitchToggle from "@/components/controlled/SwitchToggle"


//fields which used in this form
type CustomerFormFields ={
  mandatoryFields :string[],
  creditLimit:string,
  creditDays: string,
  
  //toggle(boolean)
  blockSales :boolean,
  warnCustomer: boolean,
  MRP: boolean,
  wholesale: boolean,
  specificDiscount: boolean,
  discountToAll: boolean,
  defaultDiscount: string,
  preventDeletion: boolean,
}

// mandtaory fields options and types
 type FielType ={
  label: string,
  value: string,
}
const mandatoryFieldOptions: FielType[] = [
  {label:"Customer Name", value:"customer_name"},
  {label: "Mobile Number", value:"mobile_number"},
  {label:"Email(Optional)", value:"email"},
  {label:"PhoneNumber (Optional)", value:"phone_number"}
]

// credit days dropdown item list
const creditDays:FielType[] = [
  { label: "30 Days" ,value:"30"},
  {label:"60 Days", value:"60"},
  {label:"90 Days", value:"90"}
]

// default discount dropdown item list
const defaultDiscount: FielType[] =[
  {label:"5%", value:"5"},
  {label:"10%", value:"10"},
  {label:"12%", value:"12"}
]

// Paper Styles of each field
const PaperStyle={
  backgroundColor: "#ffffff",
  borderRadius: "4px",
  p:{xs: 1.5, sm: 2, md:2.5},
  mb:2,
  py:0
}

// heading style 
const headingStyle ={
  fontWeight: 700,
  fontSize:"18px",
  color:"#212529",
  mb:1
}

// label styles
const labelStyle={
  fontSize:{xs:"15px", sm:"16px", md:"17px"},
  mb:0.5  
}

// Box style for each row(horizontally align)
const boxStyle ={
  display:"flex",
  flexDirection:{xs:"row", sm:"row", md:"row"},
  justifyContent:"space-between", 
  alignItems:{sm:"center"}, 
  mb:0.25
}

// inline label and component for dropdown and numeric field
const inputFieldStyle = {
  width: { xs: "70%", sm: 180, md: 200 }, 
  "& .MuiOutlinedInput-root": {  
    height: 42,         
    fontSize: "14px",
  },
  "& .MuiOutlinedInput-input": {  
    padding: "8px 12px",
  },
}

// checkbox style
const checkboxStyle = {
  "& .MuiCheckbox-root": {  
    color: "default.main",
    "&.Mui-checked": {      
      color: "#238878",
    },
  },
};

const CustomerSettings = () => {
  const methods = useForm<CustomerFormFields>(  
    {
      defaultValues: {
        mandatoryFields:["customer_name","mobile_number"],
        creditLimit:"10.00",
        creditDays:"90",
        blockSales:true,
        wholesale: false,
        specificDiscount: true,
        discountToAll: false,
        defaultDiscount: "10",
        preventDeletion: true,
        MRP:false,
        warnCustomer:false
      }
    });

    const onSubmit =(data:CustomerFormFields)=>{  
      console.log("submmitted data: ", data);
      alert(`submitted data  ${JSON.stringify(data)}`)
      
    }
    const {reset, getValues}=methods;
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <Paper  
        sx= {{
          py:2,
          boxShadow:"none",
          borderRadius: 0,
          backgroundColor: "transparent",
          
        }}>

          {/* title of the form */}
          <Box mb={2}> 
            <Typography fontSize={{xs:"20px", sm:"22px", md:"24px"}} fontWeight={700} >
              Customer Settings
            </Typography>

          {/* Subtitle */}
          <Typography fontSize={{xs:"12px", sm:"14px" , ms:"16px"}} color="#8f8f8f" >
            Control Customer Master Behavior and Credit Rules
          </Typography>
          </Box>

          {/* Mandatory Fields */}
          <Paper sx ={PaperStyle}>      
            <Typography sx ={headingStyle}>     
              Mandatory Fields
            </Typography>
            
            <CheckboxGroup 
            name="mandatoryFields"
            label=""
            options={mandatoryFieldOptions} 
            sx={checkboxStyle}        
            />               
          </Paper>

          {/* Credit Control field */}
          <Paper sx ={PaperStyle}>
            <Typography sx ={{...headingStyle, mb: 1}}>Credit Control</Typography>
            <Box sx={{...boxStyle,mb:-2}}>
              <Typography sx={{...labelStyle, mt:1}}>Credit Limit</Typography>
                <NumericField 
                  name= "creditLimit"
                  label= ""
                  size = "small"
                  decimal={true}
                  decimalDigits={2}
                  sx={inputFieldStyle}
                  InputProps={{
                    startAdornment: <InputAdornment position="start" >₹</InputAdornment>,
                  }}
                />
            </Box>

            {/* Credit Days */}
            <Box sx={{...boxStyle,mb:0.5}}>
              <Typography sx={{...labelStyle, mt: 1}}> Credit Days</Typography>
                <DropdownField 
                name="creditDays"
                placeholder="select"
                options={creditDays}
                sx={inputFieldStyle}
                />
            </Box>

            {/* BlockSales */}
            <Box sx={{...boxStyle, flexDirection: "row", mb: 1.5}}>
              <Typography sx={labelStyle}>Block Sales when Credit Limit Exceeded</Typography>
                <SwitchToggle name="blockSales" />
            </Box>

            {/* warn customer */}
            <Box sx={{...boxStyle, flexDirection: "row", mb: 0}}>
              <Typography sx={labelStyle}>Warn Before Exceeding Limit</Typography>
                  <SwitchToggle name="warnCustomer" />                  
            </Box>
          </Paper>

          {/* Default Price List Field */}
          <Paper sx ={PaperStyle}>
            <Typography sx ={headingStyle}>Default Price List</Typography>

            {/* MRP */}
            <Box sx={{...boxStyle, flexDirection: "row", mb: 1}}>
              <Typography sx={labelStyle}>MRP</Typography>
              <SwitchToggle name="MRP" />
            </Box>

            {/* Wholesale */}
            <Box sx={{...boxStyle, flexDirection: "row", mb: 0}}>
              <Typography sx={labelStyle}>Wholesale</Typography>
              <SwitchToggle name="wholesale"/>
            </Box>
          </Paper>

          {/* Customer Discount Field */}
          <Paper sx ={PaperStyle}>
            <Typography sx ={headingStyle}>Customer-Specific Discount</Typography>
            
            {/* Specific Discount */}
            <Box sx={{...boxStyle, flexDirection: "row", mb: 0}}>
              <Typography sx={labelStyle}>Customer Specific Discount</Typography>
              <SwitchToggle name="specificDiscount"/>
            </Box>

            {/* Defualt Discount */}
            <Box sx={{...boxStyle,mb:-1}}>
            <Typography sx={{...labelStyle, mb: 1.2}}> Default Discount(%)</Typography>
              <DropdownField 
              name ="defaultDiscount"
              placeholder="Select"
              options={defaultDiscount}
              sx={inputFieldStyle}
              />
            </Box>

            {/* Apply to all items */}
            <Box sx={{...boxStyle, flexDirection: "row", mb: 0}}>
              <Typography sx={labelStyle}>Apply To All Items</Typography>
              <SwitchToggle name="discountToAll"/>
            </Box>
          </Paper>

          {/* safety and controls */}
          <Paper sx ={PaperStyle}>
            <Typography sx ={headingStyle}>Safety and Controls</Typography>
            <Box sx={{...boxStyle, flexDirection: "row", mb: 0}}>
              <Typography sx={labelStyle}>Prevent Deletion of Customer With Transactions</Typography>
              <SwitchToggle name="preventDeletion" />
            </Box>
          </Paper>

            
    {/* reset and save buttons */}      
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0 }}>
          <Button 
            type="button" 
            variant="outlined" 
            onClick={() => {
              reset();
              console.log("afer reset: " ,getValues())
            }}                      
            sx={{
              color: "#238878",
              borderColor: "#238878",
              borderWidth: "2px",
              textTransform: "none",
              "&:hover": { 
                backgroundColor: "#238878", 
                color: "#fff", 
                borderColor: "#238878",
                borderWidth: "2px"
              },
            }}>
            Reset
          </Button>

          <Button 
            type="submit" 
            variant="contained" 
            sx={{
              backgroundColor: "#238878",
              color: "#fff",
              textTransform: "none",
              "&:hover": { 
                backgroundColor: "#fff", 
                color: "#238878", 
                borderColor: "#238878",
                borderWidth: "2px"
              },
            }}>
            Save
          </Button>
        </Box>
        </Paper>
 
      </form>
    </FormProvider>
  )}
export default CustomerSettings

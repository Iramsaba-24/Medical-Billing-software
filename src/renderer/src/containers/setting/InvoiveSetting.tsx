 import React from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { Box, Paper, Typography, Grid, Button } from '@mui/material';
import CheckboxGroup from '@/components/controlled/CheckboxGroup';
import RadioField from '@/components/controlled/RadioField';
import TextInputField from '@/components/controlled/TextInputField';


interface InvoiceSettingsForm {
  invoiceTypes: string[];
  retailSeries: string;
  wholesaleSeries: string;
  gstSeries: string;
  numberingOptions: string[];
  paymentMode: string;
  splitPayment: string[];
  printOptions: string[];
  taxMode: string;
  taxOverride: string[];
  discountRules: string;
  discountOptions: string[];
  dateControl: string[];
  cancellationRules: string[];
}

const InvoiceSettings: React.FC = () => {
  const methods = useForm<InvoiceSettingsForm>({
    defaultValues: {
      invoiceTypes: [],
      retailSeries: 'RET-0001',
      wholesaleSeries: 'WHS-0001',
      gstSeries: 'GST-0001',
      numberingOptions: [],
      paymentMode: 'Cash',
      splitPayment: [],
      printOptions: [],
      taxMode: 'Inclusive',
      taxOverride: [],
      discountRules: 'Item-level',
      discountOptions: [],
      dateControl: [],
      cancellationRules: []
    }
  });

  const onSubmit: SubmitHandler<InvoiceSettingsForm> = (data) => {
    console.log("Strictly Typed Form Data:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Box sx={{ p: 2, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Invoice Settings</Typography>

          <Grid container spacing={3}>
            
            {/*  Invoice Types */}
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 6}}>
                <CheckboxGroup
                  name="invoiceTypes"
                  label="Invoice Types"
                  options={[
                    { label: 'Retail', value: 'retail' },
                    { label: 'Wholesale', value: 'wholesale' },
                    { label: 'GST Invoice', value: 'gst' }
                  ]}
                />
              </Paper>
            </Grid>

            {/*  Invoice Numbering Series */}
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>Invoice Numbering Series</Typography>
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 8 }} alignContent="center">Retail Series</Grid>
                  <Grid size={{ xs: 4 }}><TextInputField name="retailSeries" label="" size="small" /></Grid>
                  
                  <Grid size={{ xs: 8 }} alignContent="center">Wholesale Series</Grid>
                  <Grid size={{ xs: 4 }}><TextInputField name="wholesaleSeries" label="" size="small" /></Grid>
                  
                  <Grid size={{ xs: 8 }} alignContent="center">GST Series</Grid>
                  <Grid size={{ xs: 4 }}><TextInputField name="gstSeries" label="" size="small" /></Grid>
                </Grid>
                <CheckboxGroup 
                  name="numberingOptions" 
                  label="" 
                  options={[
                    { label: 'Auto-increment', value: 'auto' },
                    { label: 'Lock series after first use', value: 'lock' }
                  ]} 
                />
              </Paper>
            </Grid>

            {/*  Default Payment Mode */}
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 2 }}>
                <RadioField
                  name="paymentMode"
                  label="Default Payment Mode"
                  sx={{ flexDirection: 'column' }}
                  options={[
                    { label: 'Cash', value: 'Cash' },
                    { label: 'UPI', value: 'UPI' },
                    { label: 'Card', value: 'Card' },
                    { label: 'Credit', value: 'Credit' }
                  ]}
                />
                <CheckboxGroup 
                  name="splitPayment" 
                  label="" 
                  options={[{ label: 'Allow split payment (Cash + UPI)', value: 'split' }]} 
                />
              </Paper>
            </Grid>

            {/*  Print Options */}
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 2 }}>
                <CheckboxGroup
                  name="printOptions"
                  label="Print Options"
                  options={[
                    { label: 'Show logo on invoice', value: 'logo' },
                    { label: 'Show GST breakup', value: 'gst_breakup' },
                    { label: 'Show HSN codes', value: 'hsn' },
                    { label: 'Print duplicate copy', value: 'duplicate' }
                  ]}
                />
              </Paper>
            </Grid>

            {/*  Tax Mode */}
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 2 }}>
                <RadioField
                  name="taxMode"
                  label="Tax Mode"
                  sx={{ flexDirection: 'column' }}
                  options={[
                    { label: 'Inclusive of GST', value: 'Inclusive' },
                    { label: 'Exclusive of GST', value: 'Exclusive' }
                  ]}
                />
                <CheckboxGroup 
                  name="taxOverride" 
                  label="" 
                  options={[{ label: 'Allow override per invoice', value: 'override' }]} 
                />
              </Paper>
            </Grid>

            {/*  Cancel & Return Rules */}
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 2 }}>
                <CheckboxGroup
                  name="cancellationRules"
                  label="Cancel & Return Rules"
                  options={[
                    { label: 'Allow invoice cancellation', value: 'cancel' },
                    { label: 'Allow sales returns', value: 'returns' }
                  ]}
                />
              </Paper>
            </Grid>

          </Grid> 

          {/* Footer Buttons */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" color="inherit" size="small" onClick={() => methods.reset()}>Reset</Button>
            <Button variant="contained" color="success" size="small" type="submit">Save</Button>
          </Box>
        </Box>
      </form>
    </FormProvider>
  );
};

export default InvoiceSettings;
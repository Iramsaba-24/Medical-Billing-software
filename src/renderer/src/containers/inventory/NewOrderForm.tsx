import { useState, useEffect } from "react";
import { Box, Button, Paper, Typography, IconButton } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import TextInputField from "@/components/controlled/TextInputField";
import EmailField from "@/components/controlled/EmailField";
import NumericField from "@/components/controlled/NumericField";
import DropdownField from "@/components/controlled/DropdownField";
import { Add, Remove } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { URL_PATH } from "@/constants/UrlPath";
import {
  getDistributors,
  type DistributorResponse,
} from "@/service/distributorService";

type OrderRow = {
  rowId: number;
};

type NewOrderFormValues = {
  distributor: string;
  email: string;
  root?: {
    message?: string;
  };
  [key: string]:
    | string
    | number
    | { message?: string }
    | undefined;
};

const orderButtonSx = {
  backgroundColor: "#238878",
  color: "#fff",
  border: "2px solid #238878",
  textTransform: "none",
  minWidth: "100px",
  height: "36px",
  "&:hover": {
    backgroundColor: "#fff",
    color: "#238878",
    border: "2px solid #238878",
  },
};

function NewOrderForm() {
  const navigate = useNavigate();

  const [rows, setRows] = useState<OrderRow[]>([
    {
      rowId: Date.now(),
    },
  ]);

  const [distributorOptions, setDistributorOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const [distributors, setDistributors] = useState<
    DistributorResponse[]
  >([]);

  const methods = useForm<NewOrderFormValues>({
    defaultValues: {
      distributor: "",
      email: "",
    },
    mode: "onChange",
  });

  const selectedDistributor =
    methods.watch("distributor");

  const fetchDistributorData = async () => {
    try {
      const data = await getDistributors();

      setDistributors(data);

      const options = data.map((item) => ({
        label: item.companyName,
        value: item.companyName,
      }));

      setDistributorOptions(options);
    } catch (error) {
      console.error(
        "Distributor fetch failed:",
        error
      );
    }
  };

  useEffect(() => {
    fetchDistributorData();
  }, []);

  useEffect(() => {
    if (!selectedDistributor) return;

    const selected = distributors.find(
      (item) =>
        item.companyName === selectedDistributor
    );

    if (selected) {
      methods.setValue(
        "email",
        selected.email
      );
    }
  }, [
    selectedDistributor,
    distributors,
    methods,
  ]);

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        rowId: Date.now(),
      },
    ]);
  };

  const handleRemoveRow = (
    rowId: number
  ) => {
    setRows((prev) =>
      prev.filter(
        (item) => item.rowId !== rowId
      )
    );
  };

  const handleOrder =
    methods.handleSubmit((data) => {
      methods.clearErrors("root");

      const hasInvalidQty = rows.some(
        (row) => {
          const qtyValue =
            data[`qty_${row.rowId}`];

          const qty =
            typeof qtyValue === "number"
              ? qtyValue
              : Number(qtyValue || 0);

          return qty < 5;
        }
      );

      if (hasInvalidQty) {
        methods.setError("root", {
          type: "manual",
          message:
            "Quantity should be at least 5 for order.",
        });

        return;
      }

      const medicines = rows.map(
        (row) => ({
          medicineName:
            data[
              `medicine_${row.rowId}`
            ],
          strengthType:
            data[
              `strength_${row.rowId}`
            ],
          qty:
            data[
              `qty_${row.rowId}`
            ],
        })
      );

      navigate(
        URL_PATH.ReorderEmail,
        {
          state: {
            distributor:
              data.distributor,
            email: data.email,
            medicines,
            orderType: "neworder",
          },
        }
      );
    });

  return (
    <FormProvider {...methods}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          p: {
            xs: 1,
            md: 2,
          },
        }}
      >
        <Paper
          elevation={2}
          sx={{
            borderRadius: 2,
            border:
              "1.5px solid #238878",
            p: {
              xs: 2,
              md: 3,
            },
          }}
        >
          <Typography
            fontWeight={700}
            fontSize={{
              xs: 16,
              md: 22,
            }}
            color="#238878"
            mb={3}
          >
            New Order
          </Typography>

          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            mb={3}
          >
            <Box
              display="flex"
              flexDirection={{
                xs: "column",
                sm: "row",
              }}
              alignItems={{
                xs: "flex-start",
                sm: "center",
              }}
              gap={1.5}
            >
              <Typography
                sx={{
                  width: {
                    sm: 120,
                  },
                }}
                fontWeight={600}
              >
                Distributor
              </Typography>

              <Box
                sx={{
                  width: {
                    xs: "100%",
                    sm: 260,
                  },
                }}
              >
                <DropdownField
                  name="distributor"
                  label=""
                  options={
                    distributorOptions
                  }
                  required
                />
              </Box>
            </Box>

            <Box
              display="flex"
              flexDirection={{
                xs: "column",
                sm: "row",
              }}
              alignItems={{
                xs: "flex-start",
                sm: "center",
              }}
              gap={1.5}
            >
              <Typography
                sx={{
                  width: {
                    sm: 120,
                  },
                }}
                fontWeight={600}
              >
                Email
              </Typography>

              <Box
                sx={{
                  width: {
                    xs: "100%",
                    sm: 260,
                  },
                }}
              >
                <EmailField
                  name="email"
                  label=""
                />
              </Box>
            </Box>
          </Box>

          <Box
            display="flex"
            justifyContent="flex-end"
            mb={2}
          >
            <Button
              startIcon={<Add />}
              onClick={handleAddRow}
              sx={{
                color: "#238878",
                fontWeight: "bold",
              }}
            >
              ADD ITEM
            </Button>
          </Box>

          {rows.map((row) => (
            <Box
              key={row.rowId}
              display="flex"
              flexDirection={{
                xs: "column",
                md: "row",
              }}
              gap={2}
              mb={2}
              alignItems={{
                xs: "stretch",
                md: "center",
              }}
            >
              <Box
                sx={{
                  flex: 2,
                  width: "100%",
                }}
              >
                <TextInputField
                  name={`medicine_${row.rowId}`}
                  label="Medicine Name"
                  required
                  minLength={3}
                  maxLength={9999}
                />
              </Box>

              <Box
                sx={{
                  flex: 2,
                  width: "100%",
                }}
              >
                <TextInputField
                  name={`strength_${row.rowId}`}
                  label=" Strength / Type"
                  required
                />
              </Box>

              <Box
                sx={{
                  flex: 1,
                  width: "100%",
                }}
              >
                <NumericField
                  name={`qty_${row.rowId}`}
                  label="Quantity"
                  min={1}
                  max={9999}
                  required
                />
              </Box>

              {rows.length > 1 && (
                <Box
                  display="flex"
                  justifyContent={{
                    xs: "flex-end",
                    md: "center",
                  }}
                  alignItems="center"
                >
                  <IconButton
                    color="error"
                    onClick={() =>
                      handleRemoveRow(
                        row.rowId
                      )
                    }
                  >
                    <Remove />
                  </IconButton>
                </Box>
              )}
            </Box>
          ))}

          {methods.formState.errors.root
            ?.message && (
            <Typography
              color="error"
              fontSize={14}
              mb={2}
            >
              {
                methods.formState
                  .errors.root.message
              }
            </Typography>
          )}

          <Box
            display="flex"
            justifyContent="flex-end"
            gap={2}
            mt={2}
          >
            <Button
              variant="outlined"
              sx={{
                ...orderButtonSx,
                backgroundColor:
                  "#fff",
                color: "#238878",
              }}
              onClick={() =>
                navigate(
                  URL_PATH.Reorder
                )
              }
            >
              Order History
            </Button>

            <Button
              sx={orderButtonSx}
              onClick={handleOrder}
            >
              Order
            </Button>
          </Box>
        </Paper>
      </Box>
    </FormProvider>
  );
}

export default NewOrderForm;
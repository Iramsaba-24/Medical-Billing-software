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
  [key: string]: string | number;
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
            data[`qty_${row.rowId}`],
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

          {/* Distributor */}
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

          {/* Add Button */}
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

          {/* Header */}
          <Box
            display={{
              xs: "none",
              md: "flex",
            }}
            gap={2}
            mb={1}
            px={0.5}
          >
            <Typography
              sx={{ flex: 2 }}
              fontWeight={600}
            >
              Medicine Name
            </Typography>

            <Typography
              sx={{ flex: 2 }}
              fontWeight={600}
            >
              Strength / Type
            </Typography>

            <Typography
              sx={{ flex: 1 }}
              fontWeight={600}
            >
              Qty.
            </Typography>

            <Box
              sx={{
                width: 50,
              }}
            />
          </Box>

          {/* Rows */}
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
                <Box
                  display={{
                    xs: "block",
                    md: "none",
                  }}
                  mb={0.5}
                >
                  <Typography
                    fontWeight={600}
                    fontSize={14}
                  >
                    Medicine Name
                  </Typography>
                </Box>

                <TextInputField
                  name={`medicine_${row.rowId}`}
                  label=""
                />
              </Box>

              <Box
                sx={{
                  flex: 2,
                  width: "100%",
                }}
              >
                <Box
                  display={{
                    xs: "block",
                    md: "none",
                  }}
                  mb={0.5}
                >
                  <Typography
                    fontWeight={600}
                    fontSize={14}
                  >
                    Strength / Type
                  </Typography>
                </Box>

                <TextInputField
                  name={`strength_${row.rowId}`}
                  label=""
                />
              </Box>

              <Box
                sx={{
                  flex: 1,
                  width: "100%",
                }}
              >
                <Box
                  display={{
                    xs: "block",
                    md: "none",
                  }}
                  mb={0.5}
                >
                  <Typography
                    fontWeight={600}
                    fontSize={14}
                  >
                    Qty.
                  </Typography>
                </Box>

                <NumericField
                  name={`qty_${row.rowId}`}
                  label=""
                  min={1}
                  max={9999}
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
                  mt={{
                    xs: -1,
                    md: 2,
                  }}
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

          {/* Submit */}
          <Box
            display="flex"
            justifyContent="flex-end"
            mt={2}
          >
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
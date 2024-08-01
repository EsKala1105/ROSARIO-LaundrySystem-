/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import styled from "styled-components";
import { simboloMoneda } from "../../../../../services/global";
import { NumberInput } from "@mantine/core";
import { useEffect } from "react";
import { formatThousandsSeparator } from "../../../../../utils/functions";

const CashCounterStyle = styled.div`
  margin: auto;

  table {
    display: block;
    border-collapse: collapse;
    margin: 10px auto;

    &::-webkit-scrollbar {
      width: 0;
    }

    tr {
      position: relative;
      display: grid;
      grid-template-columns: 100px 100px 200px;
    }

    thead {
      tr {
        th {
          background: #5b81ea;
          color: #fff;
          font-weight: bold;
          padding: 10px;
          text-align: center;
          font-size: 18px;
        }
      }
    }

    tbody {
      tr {
        td {
          position: relative;
          padding: 10px 5px;
          border: 1px solid #4672ea79;
          text-align: center;
          font-size: 14px;
          vertical-align: top;
          display: flex;
          justify-content: center;
          align-items: center;
          &:last-child {
            border-right: 1px solid #4672ea79 !important;
          }

          input {
            width: 65px;
            height: 28px;
            font-size: 18px !important;
            border-radius: 7px;
            font-size: 14px;
            border: none;
            text-align: center;
            outline: none;
          }

          label {
            margin: auto;
            font-size: 18px;
          }

          &:nth-child(2) {
            background-color: #75757559;
          }
        }
      }
    }
  }

  .footer-info {
    width: 100%;
    margin: 10px auto;
    display: flex;
    justify-content: space-between;

    .input-number {
      width: 100%;
      margin: 10px auto;
      display: flex;
      justify-content: right;

      label {
        color: #7a7dbb;
        text-transform: uppercase;
        font-size: 17px;
        font-weight: bold;
        letter-spacing: 0.05em;
        margin: auto;
        margin-right: 10px;
      }

      input {
        display: inline-block;
        font-size: 18px;
        text-align: center;
        border: 2px solid #7a7dbb;
        width: 200px;
        height: 30px;
        color: #3d44c9;
        border-radius: 7px;
        font-family: "PT Sans", sans-serif;
        font-weight: bold;
        background: transparent;
        outline: 0;

        &:focus::placeholder {
          color: transparent;
        }

        &::placeholder {
          display: inline-block;
          font-size: 18px;
          padding: auto;
          font-family: "PT Sans", sans-serif;
          font-weight: bold;
          color: #67688a77;
        }
      }
    }
  }
`;

const CashCounter = ({
  ListMontos,
  totalCaja,
  handleChangeTotalCaja,
  handleChangeMontos,
  sDisabledCuadre,
}) => {
  const handleCalculateTotalNeto = (Montos) => {
    let totalNeto = 0;
    if (Montos && Montos.length > 0) {
      totalNeto = Montos.reduce((sum, monto) => {
        const total = parseFloat(monto.total) || 0;

        return sum + total;
      }, 0);
    }

    handleChangeTotalCaja(totalNeto);
  };

  useEffect(() => {
    handleCalculateTotalNeto(ListMontos);
  }, [ListMontos]);

  return (
    <CashCounterStyle>
      <table>
        <thead>
          <tr>
            <th>Monto</th>
            <th>Cantidad</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {ListMontos?.map((mS, index) => (
            <tr key={index}>
              <td>
                <label htmlFor="">
                  {simboloMoneda} {mS.monto}
                </label>
              </td>
              <td>
                <NumberInput
                  name="codigo"
                  value={mS.cantidad ? +mS.cantidad : ""}
                  precision={0}
                  onChange={(e) => {
                    const updatedMontos = [...ListMontos];
                    const updatedMonto = {
                      ...updatedMontos[index],
                    };
                    updatedMonto.cantidad = e;
                    updatedMonto.total = (mS.monto * e).toFixed(2);
                    updatedMontos[index] = updatedMonto;
                    handleChangeMontos(updatedMontos);
                  }}
                  min={0}
                  step={1}
                  disabled={sDisabledCuadre}
                  hideControls
                  autoComplete="off"
                />
              </td>
              <td>
                <label htmlFor="">
                  {formatThousandsSeparator((+mS.total).toFixed(2), true)}
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="footer-info">
        <div className="input-number">
          <label>Total S./</label>
          <input
            id="input-descuento"
            name="descuento"
            type="text"
            placeholder="Descuento..."
            autoComplete="off"
            value={formatThousandsSeparator(+totalCaja.toFixed(2))}
            readOnly
          />
        </div>
      </div>
    </CashCounterStyle>
  );
};

export default CashCounter;

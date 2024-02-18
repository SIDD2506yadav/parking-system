import React, { useContext, useRef, useState } from "react";
import SpaceContext from "../Hooks/SpaceContext";
import { Link } from "react-router-dom";
const Home = () => {
  const { space } = useContext(SpaceContext);
  const vehicleInput = useRef({});
  const [parkingSlot, setParkingSlot] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [formState, setFormState] = useState({
    error: null,
    disabled: false,
    loading: false,
  });
  const [ticketFormState, setTicketFormState] = useState({
    error: null,
    disabled: false,
    loading: false,
  })
  const parkingSlotMapping = [
    {
      label: "Select vehicle Type",
      value: null,
    },
    {
      label: "Small",
      value: 1,
    },
    {
      label: "Medium",
      value: 2,
    },
    {
      label: "Large",
      value: 3,
    },
    {
      label: "Extra Large",
      value: 4,
    },
  ];

  const handleVehicleInput = (event) => {
    const { name, value } = event.target;
    vehicleInput.current = {
      ...vehicleInput.current,
      [name]: value,
    };
  };

  const getParkingSpot = async (event) => {
    event.preventDefault();
    setFormState({ error: null, disabled: false, loading: true });
    const { type } = vehicleInput.current;
    if (!type) {
      return;
    }

    const body = JSON.stringify({
      spaceId: space.id,
      type: parseInt(type),
    });
    try {
      const response = await fetch(`http://localhost:3001/slot/fillSlot`, {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const { slot } = await response.json();
        setParkingSlot(slot);
        setFormState({ error: null, disabled: true, loading: false });
      } else if (response.status === 404) {
        setFormState({
          error: "No parking slot found for the vehicle.",
          disabled: false,
          loading: false,
        });
      } else {
        setFormState({
          error: "Unable to find parking slot, Some error occured.",
          disabled: false,
          loading: false,
        });
      }
    } catch (err) {
      setFormState({
        error:
          err.message || "Unable to find parking slot, Some error occured.",
        disabled: false,
        loading: false,
      });
    }
  };

  const cancelSlot = async () => {
    try {
      const response = await fetch("http://localhost:3001/slot/releaseSlot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: parkingSlot.id,
        }),
      });
      if (response.status === 200) {
        setParkingSlot(null);
        setFormState({ error: null, disabled: false, loading: false });
      }
    } catch (err) {}
  };

  const generateTicket = async () => {
    setTicket(null);
    try {
      setTicketFormState({
        error: null,
        loading: true,
        disabled: true
      });
      const response = await fetch(
        "http://localhost:3001/ticket/createTicket",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slotId: parkingSlot.id,
            vehicleMeta: { vehicleNumber: vehicleInput.current.vehicleNumber },
            spaceId: space.id
          }),
        }
      );
      if (response.status === 200) {
        const { ticket } = await response.json();
        setTicket(ticket);
        setTicketFormState({
          error: null,
          loading: false,
          disabled: true
        });
      } else {
        const { message } = await response.json();
        setTicketFormState({
          error: message,
          loading: false,
          disabled: false
        });
      }
    } catch (err) {
      setTicketFormState({
        error: err.message,
        loading: false,
        disabled: false
      });
    }
  };

  const reset = () => {
    setParkingSlot(null);
    setTicket(null);
    setFormState({
      error: null,
      loading: false,
      disabled: false
    });
    setTicketFormState({
      error: null,
      loading: false,
      disabled: false
    });
  }

  return (
    <div className="home__main">
      <div className="home__container">
        <h1 className="home__space__header">{space.title}</h1>
        <form className="home__ticket__form" onSubmit={getParkingSpot}>
          <h2 className="home__create__ticket">Create Ticket</h2>
          <label className="create__ticket__input__label">
            Enter Vehicle Number
          </label>
          <input
            className="create__ticket__input"
            type="text"
            required
            name="vehicleNumber"
            onChange={handleVehicleInput}
          ></input>
          <label htmlFor="" className="create__ticket__input__label">
            Select Vehicle Type
          </label>
          <select
            defaultValue={null}
            className="create__ticket__input"
            name="type"
            onChange={handleVehicleInput}
            required
          >
            {parkingSlotMapping.map(({ label, value }) => {
              return <option value={value}>{label}</option>;
            })}
          </select>
          <input
            type="submit"
            className="create__ticket__parking__spot create__ticket__input"
            value="Get Parking Spot"
            disabled={formState.disabled}
          />
        </form>
        {parkingSlot ? (
          <div className="home__slot__info">
            <div className="divider"></div>
            <h3 className="home__slot__header">Parking Slot Info: </h3>
            <strong className="home__slot__floor">
              Floor Number: {parkingSlot.floor}
            </strong>
            <strong className="home__slot__baynumber">
              Bay Number: {parkingSlot.bayNumber}
            </strong>
            <button
              className="home_ticket_buttons home_ticket_buttons_submit"
              onClick={generateTicket}
              disabled={ticketFormState.disabled}
            >
              Generate Ticket
            </button>
            <button
              className="home_ticket_buttons home_ticket_buttons_cancel"
              onClick={cancelSlot}
              disabled={ticketFormState.disabled}
            >
              Cancel Slot
            </button>
          </div>
        ) : (
          <p className="login__spaceError">{formState.error}</p>
        )}
        {ticket ? (
          <div>
            <div className="home__slot__info">
              <div className="divider"></div>
              <h3 className="home__slot__header">Ticket Created: </h3>
              <strong className="home__slot__floor">
                Ticket Id: {ticket.id}
              </strong>
              <button className="home_ticket_buttons home_ticket_buttons_submit" onClick={reset}>Done</button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Home;

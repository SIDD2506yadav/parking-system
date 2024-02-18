import React, { useContext, useEffect, useRef, useState } from "react";
import SpaceContext from "../Hooks/SpaceContext";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const { space } = useContext(SpaceContext);
  const [loading, setLoading] = useState(false);
  const ticketsRef = useRef({
    start: 0,
  });

  const fetchTickets = async (signal) => {
    setLoading(true);
    try {
      const reqConfig = {};
      if (signal) {
        reqConfig.signal = signal;
      }

      const response = await fetch(
        `http://localhost:3001/ticket/getAllTickets?spaceId=${space.id}&first=${ticketsRef.current.start}`,
        reqConfig
      );
      if (response.status === 200) {
        const { tickets } = await response.json();
        if (!Array.isArray(tickets)) {
          return;
        }
        setTickets((prev) => [...prev, ...tickets]);
        ticketsRef.current = {
          start: ticketsRef.current.start + 10,
        };
      }
    } catch (err) {
      console.log(err)
    }
    setLoading(false);
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchTickets(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  const closeTicket = async (ticket, index) => {
    try {
      const { id, slot } = ticket;
      const response = await fetch(`http://localhost:3001/ticket/closeTicket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          slotId: slot,
        }),
      });
      if (response.status === 200) {
        const ticketsList = [...tickets];
        ticket.status = "closed";
        ticket.exitAt = new Date();
        ticketsList[index] = ticket;
        setTickets(ticketsList);
      }
    } catch (err) {}
  };

  return (
    <div className="tickets__main">
      <div className="tickets__container">
        <h3 className="tickets__header">Tickets: </h3>
        <div className="ticket__list">
          {tickets.map((ticket, index) => {
            const { id, vehicleMeta, entryAt, exitAt, status } = ticket;
            return (
              <div className="ticket__item" key={id}>
                <label className="label">Ticket Id: </label>
                <strong className="ticket__fields">{id}</strong>
                <label className="label">Vehicle Number: </label>
                <p className="ticket__fields">{vehicleMeta.vehicleNumber}</p>
                <label className="label">Enter At: </label>
                <p className="ticket__fields">
                  {new Date(entryAt).toUTCString()}
                </p>
                {status === "closed" ? (
                  <>
                    <label className="label">Exited At: </label>
                    <p className="ticket__fields">
                      {new Date(exitAt).toUTCString()}
                    </p>
                  </>
                ) : (
                  <></>
                )}
                <label className="label">Ticket Status: </label>
                <p className="ticket__fields">{ticket.status}</p>
                {status === "closed" ? (
                  <></>
                ) : (
                  <button
                    className="tickets__close"
                    onClick={() => closeTicket(ticket, index)}
                  >
                    Close Ticket
                  </button>
                )}
                <div className="divider"></div>
              </div>
            );
          })}
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <button className="tickets__close" onClick={() => fetchTickets()}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default Tickets;

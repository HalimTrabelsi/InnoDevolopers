import React from "react";
import { Link } from "react-router-dom";

const PaymentHistoryOne = () => {
  return (
    <div className="card radius-16 mt-24">
      <div className="card-header">
        <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
          <h6 className="mb-2 fw-bold text-lg mb-0">Historique des paiements</h6>

        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th scope="col">Utilisateurs</th>
                <th scope="col" className="text-center">
                  Email
                </th>
                <th scope="col" className="text-center">
                  ID de la transaction
                </th>
                <th scope="col" className="text-center">
                  Montant
                </th>
                <th scope="col" className="text-center">
                  Méthode de paiement
                </th>
                <th scope="col" className="text-center">
                  Date
                </th>
                <th scope="col" className="text-center">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="">
                  <div className="d-flex align-items-center">
                    <img
                      src="assets/images/users/user1.png"
                      alt=""
                      className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
                    />
                    <div className="flex-grow-1">
                      <h6 className="text-md mb-0 fw-medium">Khaled Ben Ali</h6>
                    </div>
                  </div>
                </td>
                <td className="text-center">khaledbenali@gmail.com</td>
                <td className="text-center">9562415412263</td>
                <td className="text-center">80.00 TND</td>
                <td className="text-center">Banque</td>
                <td className="text-center">24 Janv 2025</td>
                <td className="text-center">
                  <span className="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">
                    Actif
                  </span>
                </td>
              </tr>
              <tr>
                <td className="">
                  <div className="d-flex align-items-center">
                    <img
                      src="assets/images/users/user2.png"
                      alt=""
                      className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
                    />
                    <div className="flex-grow-1">
                      <h6 className="text-md mb-0 fw-medium">Mouna Larbi</h6>
                    </div>
                  </div>
                </td>
                <td className="text-center">mounalarbi@gmail.com</td>
                <td className="text-center">9562415412263</td>
                <td className="text-center">65.00 TND</td>
                <td className="text-center">Banque</td>
                <td className="text-center">22 Mars 2025</td>
                <td className="text-center">
                  <span className="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">
                    Actif
                  </span>
                </td>
              </tr>
              <tr>
                <td className="">
                  <div className="d-flex align-items-center">
                    <img
                      src="assets/images/users/user3.png"
                      alt=""
                      className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
                    />
                    <div className="flex-grow-1">
                      <h6 className="text-md mb-0 fw-medium">Sami Ben Ahmed</h6>
                    </div>
                  </div>
                </td>
                <td className="text-center">sami@gmail.com</td>
                <td className="text-center">9562415412263</td>
                <td className="text-center">120.00 TND</td>
                <td className="text-center">Carte bancaire</td>
                <td className="text-center">03 Mars 2025</td>
                <td className="text-center">
                  <span className="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">
                    Actif
                  </span>
                </td>
              </tr>
              <tr>
                <td className="">
                  <div className="d-flex align-items-center">
                    <img
                      src="assets/images/users/user4.png"
                      alt=""
                      className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
                    />
                    <div className="flex-grow-1">
                      <h6 className="text-md mb-0 fw-medium">Ahmed Morsi</h6>
                    </div>
                  </div>
                </td>
                <td className="text-center">ahmedmorsi@gmail.com</td>
                <td className="text-center">9562415412263</td>
                <td className="text-center">50.00 TND</td>
                <td className="text-center">Banque</td>
                <td className="text-center">15 Fev 2025</td>
                <td className="text-center">
                  <span className="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">
                    Actif
                  </span>
                </td>
              </tr>
              <tr>
                <td className="">
                  <div className="d-flex align-items-center">
                    <img
                      src="assets/images/users/user5.png"
                      alt=""
                      className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
                    />
                    <div className="flex-grow-1">
                      <h6 className="text-md mb-0 fw-medium">Leila Chouiref</h6>
                    </div>
                  </div>
                </td>
                <td className="text-center">leilachouiref@mail.tn</td>
                <td className="text-center">9562415412263</td>
                <td className="text-center">95.00 TND</td>
                <td className="text-center">Carte bancaire</td>
                <td className="text-center">30 Janv 2025</td>
                <td className="text-center">
                  <span className="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">
                    Actif
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryOne;

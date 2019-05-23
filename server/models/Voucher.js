module.exports = (sequelize, DataTypes) => {
  const Voucher = sequelize.define('Voucher', {
    id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
    },
    paymentMethod: {
      type: DataTypes.ENUM('CC', 'BANK'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('UNPAID', 'PAID'),
      allowNull: false,
    },
    amountPaid: DataTypes.INTEGER,
    dateSold: DataTypes.DATEONLY,
    boxType: {
      type: DataTypes.ENUM('SILVER', 'GOLD', 'PLATINUM'),
      allowNull: false,
    },
    transactionId: DataTypes.STRING,
    buyerName: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    buyerSurname: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    buyerEmail: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    buyerPhone: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
  });

  return Voucher;
};

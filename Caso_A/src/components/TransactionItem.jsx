import { formatDate, getCategory } from '../data';
import { useFinance } from '../context/FinanceContext';
import Icon from './Icon';

export default function TransactionItem({ transaction }) {
  const { formatCurrency } = useFinance();
  const category = getCategory(transaction.category);
  const isIncome = transaction.amount > 0;

  return (
    <div className="transaction-item">
      <span
        className="transaction-category-icon"
        style={{
          color: category.color,
          background: `color-mix(in srgb, ${category.color} 13%, transparent)`,
        }}
      >
        <Icon name={category.icon} size={19} />
      </span>
      <div className="transaction-main">
        <strong>{transaction.merchant}</strong>
        <span>
          {transaction.description}
          <i>•</i>
          {formatDate(transaction.date)}
        </span>
      </div>
      <span className="transaction-category">{transaction.category}</span>
      <strong
        className={`transaction-amount ${isIncome ? 'is-income' : 'is-expense'}`}
      >
        {isIncome ? '+' : ''}
        {formatCurrency(transaction.amount)}
      </strong>
    </div>
  );
}

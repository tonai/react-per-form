import { ReactElement, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

interface ILayoutProps {
  children: ReactNode;
}

export default function Layout(props: ILayoutProps): ReactElement {
  const { children } = props;
  return (
    <div className="layout">
      <nav>
        <ul className="layout__list">
          <li>
            <Link className="layout__link" to="/">
              Hook Simple Input
            </Link>
          </li>
          <li>
            <Link className="layout__link" to="/hook-double">
              Hook Double Input
            </Link>
          </li>
          <li>
            <Link className="layout__link" to="/hook-dynamic">
              Hook Dynamic Input
            </Link>
          </li>
        </ul>
        <ul className="layout__list">
          <li>
            <Link className="layout__link" to="/component-simple">
              Component Simple Input
            </Link>
          </li>
          <li>
            <Link className="layout__link" to="/component-double">
              Component Double Input
            </Link>
          </li>
          <li>
            <Link className="layout__link" to="/component-dynamic">
              Component Dynamic Input
            </Link>
          </li>
        </ul>
      </nav>
      {children}
    </div>
  );
}

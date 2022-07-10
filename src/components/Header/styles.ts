import styled from 'styled-components'

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  nav {
    display: flex;
    gap: 0.5rem;

    a {
      width: 3rem;
      height: 3rem;

      display: flex;
      justify-content: center;
      align-items: center;
      border-top: 3px solid transparent;
      border-bottom: 3px solid transparent;

      color: ${({ theme }) => theme['gray-100']};

      transition: border 0.3s ease;

      &:hover {
        border-bottom-color: ${({ theme }) => theme['green-500']};
      }

      &.active {
        color: ${({ theme }) => theme['green-500']};
        border-bottom-color: ${({ theme }) => theme['green-500']};
      }
    }
  }
`

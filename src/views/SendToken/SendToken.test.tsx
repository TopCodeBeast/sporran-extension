import userEvent from '@testing-library/user-event';
import { BalanceUtils } from '@kiltprotocol/core';
import { DataUtils } from '@kiltprotocol/utils';
import {
  Blockchain,
  BlockchainApiConnection,
} from '@kiltprotocol/chain-helpers';

import { NEW } from '../../utilities/identities/identities';
import {
  identitiesMock as identities,
  render,
  runWithJSDOMErrorsDisabled,
  screen,
} from '../../testing/testing';
import { getFee } from '../../utilities/getFee/getFee';
import '../../components/usePasteButton/usePasteButton.mock';

import { SendToken } from './SendToken';

jest.mock('../../utilities/getFee/getFee', () => ({ getFee: jest.fn() }));
jest.mocked(getFee).mockResolvedValue(BalanceUtils.toFemtoKilt(0.001));

jest.mocked(BlockchainApiConnection.getConnectionOrConnect).mockResolvedValue({
  api: {
    consts: {
      balances: { existentialDeposit: BalanceUtils.toFemtoKilt(0.1) },
    },
  },
} as Blockchain);

const identity = identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('SendToken', () => {
  beforeEach(() => {
    jest.mocked(DataUtils.validateAddress).mockReset();
    Object.defineProperty(window.navigator, 'onLine', {
      value: true,
      writable: true,
    });
  });

  it('should render', async () => {
    const { container } = render(
      <SendToken identity={identity} onSuccess={jest.fn()} />,
    );
    await screen.findByText(/Maximum transferable amount: 1.2150/);
    expect(container).toMatchSnapshot();
  });

  it('should not render for new identity', async () => {
    const { container } = render(
      <SendToken identity={NEW} onSuccess={jest.fn()} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should submit correct values', async () => {
    const address = '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr';
    const onSuccess = jest.fn();
    render(<SendToken identity={identity} onSuccess={onSuccess} />);

    const submit = await screen.findByRole('button', {
      name: 'Review & Sign Transaction',
    });
    expect(submit).toBeDisabled();

    await userEvent.type(await screen.findByLabelText('Amount to send'), '1');
    await userEvent.type(
      await screen.findByLabelText('Paste the recipient’s address here'),
      address,
    );
    await userEvent.click(
      await screen.findByLabelText('Increase the tip by 1%'),
    );
    await screen.findByText(/Maximum transferable amount: 1.2150/);

    await runWithJSDOMErrorsDisabled(async () => {
      await userEvent.click(submit);
    });

    expect(onSuccess).toHaveBeenCalled();
    const values = onSuccess.mock.calls[0][0];
    expect(values.recipient).toEqual(address);
    expect(values.amount.toString()).toEqual('1000000000000000');
    expect(values.fee.toString()).toEqual('1000000000000');
    expect(values.tip.toString()).toEqual('10000000000000');
  });

  it('should warn if balance will go below existential deposit', async () => {
    const recipientAddress = '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL';
    const onSuccess = jest.fn();

    render(<SendToken identity={identity} onSuccess={onSuccess} />);

    await userEvent.type(await screen.findByLabelText('Amount to send'), '1.2');
    await userEvent.type(
      await screen.findByLabelText('Paste the recipient’s address here'),
      recipientAddress,
    );

    const submit = await screen.findByRole('button', {
      name: 'Review & Sign Transaction',
    });
    await runWithJSDOMErrorsDisabled(async () => {
      await userEvent.click(submit);
    });

    expect(onSuccess).toHaveBeenCalled();

    const values = onSuccess.mock.calls[0][0];

    expect(values.existentialWarning).toBe(true);
    expect(values.tip.toString()).toEqual('14950003355444');
  });

  it('should report too small an amount', async () => {
    render(<SendToken identity={identity} onSuccess={jest.fn()} />);

    await userEvent.type(await screen.findByLabelText('Amount to send'), '0');

    expect(
      await screen.findByText('The minimum transferable amount is 0.0100'),
    ).toBeInTheDocument();
  });

  it('should report exponentially small amount', async () => {
    render(<SendToken identity={identity} onSuccess={jest.fn()} />);
    await userEvent.type(
      await screen.findByLabelText('Amount to send'),
      '0.0000000000001',
    );
    expect(
      await screen.findByText('The minimum transferable amount is 0.0100'),
    ).toBeInTheDocument();
  });

  it('should report too large an amount', async () => {
    render(<SendToken identity={identity} onSuccess={jest.fn()} />);

    await userEvent.type(await screen.findByLabelText('Amount to send'), '111');

    expect(
      await screen.findByText(
        'The amount entered exceeds your maximum transferable amount',
      ),
    ).toBeInTheDocument();
  });

  it('should report the too large fee', async () => {
    render(<SendToken identity={identity} onSuccess={jest.fn()} />);

    await userEvent.click(
      await screen.findByLabelText('Increase the tip by 1%'),
    );
    await userEvent.type(
      await screen.findByLabelText('Amount to send'),
      '1.215',
    );

    expect(
      await screen.findByText(
        'The amount+costs exceed your maximum transferable amount',
      ),
    ).toBeInTheDocument();
  });

  it('should not throw for values larger than 1e22 femtokoins', async () => {
    render(<SendToken identity={identity} onSuccess={jest.fn()} />);

    await userEvent.type(
      await screen.findByLabelText('Amount to send'),
      '1111111',
    );

    expect(
      await screen.findByText(
        'The amount entered exceeds your maximum transferable amount',
      ),
    ).toBeInTheDocument();
  });

  it('should report an invalid amount', async () => {
    render(<SendToken identity={identity} onSuccess={jest.fn()} />);

    await userEvent.type(
      await screen.findByLabelText('Amount to send'),
      ',.,.,.',
    );

    expect(
      await screen.findByText('The value entered is not a number'),
    ).toBeInTheDocument();
  });

  it('should report an invalid recipient', async () => {
    jest.mocked(DataUtils.validateAddress).mockImplementation(() => {
      throw new Error();
    });

    render(<SendToken identity={identity} onSuccess={jest.fn()} />);

    await userEvent.type(
      await screen.findByLabelText('Paste the recipient’s address here'),
      'My grampa’s cottage',
    );

    expect(
      await screen.findByText('The address is invalid. Please check it again.'),
    ).toBeInTheDocument();
  });

  it('should report the same recipient', async () => {
    render(<SendToken identity={identity} onSuccess={jest.fn()} />);

    await userEvent.type(
      await screen.findByLabelText('Paste the recipient’s address here'),
      identity.address,
    );

    expect(
      await screen.findByText(
        'The recipient address is the same as Identity address',
      ),
    ).toBeInTheDocument();
  });

  it('should warn about being offline', async () => {
    Object.defineProperty(window.navigator, 'onLine', {
      value: false,
    });

    render(<SendToken identity={identity} onSuccess={jest.fn()} />);

    expect(
      await screen.findByText(/Cannot connect to the network/),
    ).toBeInTheDocument();
  });

  it('should allow all transferable balance to be sent if there is enough usableForFee balance', async () => {
    render(<SendToken identity={identity} onSuccess={jest.fn()} />);

    await userEvent.type(
      await screen.findByLabelText('Amount to send'),
      '1.215',
    );
    await screen.findByText(/Maximum transferable amount: 1.2150/);

    expect(
      screen.queryByText(
        'The amount+costs exceed your maximum transferable amount',
      ),
    ).not.toBeInTheDocument();
  });
});

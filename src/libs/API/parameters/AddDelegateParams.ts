import type {DelegateRole} from '@src/types/onyx/Account';

type AddDelegateParams = {
    delegateEmail: string;
    role: DelegateRole;
    validateCode: string;
};

export default AddDelegateParams;

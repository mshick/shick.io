import { atom, useAtom } from 'jotai'
import {
  createScope,
  molecule,
  ScopeProvider,
  useMolecule
} from 'jotai-molecules'

const CompanyScope = createScope<string>('example.com')

const CompanyMolecule = molecule((_, getScope) => {
  const company = getScope(CompanyScope)
  const companyNameAtom = atom(company.toUpperCase())
  return {
    company,
    companyNameAtom
  }
})

const UserScope = createScope<string>('bob@example.com')

const UserMolecule = molecule((getMol, getScope) => {
  const userId = getScope(UserScope)
  const companyAtoms = getMol(CompanyMolecule)
  const userNameAtom = atom(userId + ' name')
  const userCountryAtom = atom(userId + ' country')
  const groupAtom = atom((get) => {
    return get(userNameAtom) + ' in ' + get(companyAtoms.companyNameAtom)
  })
  return {
    userId,
    userCountryAtom,
    userNameAtom,
    groupAtom,
    company: companyAtoms.company
  }
})

const UserComponent = () => {
  const userAtoms = useMolecule(UserMolecule)
  const [userName, setUserName] = useAtom(userAtoms.userNameAtom)
  const [groupAtom] = useAtom(userAtoms.groupAtom)
  const companyMolecule = useMolecule(CompanyMolecule)
  const [companyName, setCompanyName] = useAtom(companyMolecule.companyNameAtom)

  return (
    <div>
      Hi, {groupAtom} <br />
      <input
        type="text"
        value={userName}
        onInput={(e) => setUserName((e.target as HTMLInputElement).value)}
      />
      <input
        type="text"
        value={companyName}
        onInput={(e) => setCompanyName((e.target as HTMLInputElement).value)}
      />
    </div>
  )
}

export default function MoleculesPage() {
  return (
    <ScopeProvider scope={UserScope} value={'sam@example.com'}>
      <ScopeProvider scope={CompanyScope} value={'MYCOMPANY'}>
        <UserComponent />
      </ScopeProvider>
    </ScopeProvider>
  )
}

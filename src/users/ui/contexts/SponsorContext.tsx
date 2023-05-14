import React from 'react'
import { type Sponsor } from '@/users/models/sponsor.interface'

interface SponsorContextInterface {

  sponsors: Sponsor[]
  addSponsor: (sponsor: Sponsor) => void
  updateSponsor: (sponsor: Sponsor) => void

  selectedSponsor: Sponsor | null
  setSelectedSponsor: (sponsor: Sponsor | null) => void

  sponsorForm: Sponsor | null
  setSponsorForm: (sponsorForm: Sponsor | null) => void
}

export const SponsorContext = React.createContext<SponsorContextInterface>({
  sponsors: [],
  addSponsor: () => { },
  updateSponsor: () => { },
  selectedSponsor: null,
  setSelectedSponsor: () => { },
  sponsorForm: null,
  setSponsorForm: () => { }
})

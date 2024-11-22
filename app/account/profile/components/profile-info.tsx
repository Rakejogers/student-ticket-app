import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BadgeCheck, AtSign, Phone, DollarSign } from 'lucide-react'
import { RecordModel } from "pocketbase"
import { parsePhoneNumber } from 'libphonenumber-js'

interface ProfileInfoProps {
  user: RecordModel
  onUpdateVenmo: () => void
  onUpdatePhone: () => void
  onVerifyEmail: () => void
  verificationCooldown: number
}

export function ProfileInfo({ user, onUpdateVenmo, onUpdatePhone, onVerifyEmail, verificationCooldown }: ProfileInfoProps) {
  return (
    <Card>
      <CardContent className="grid gap-6 p-6">
        <InfoItem
          icon={AtSign}
          label="Email"
          value={user.email}
          verified={user.verified}
          onVerify={onVerifyEmail}
          verificationCooldown={verificationCooldown}
        />
        <InfoItem
          icon={Phone}
          label="Phone"
          value={user.phone}
          onUpdate={onUpdatePhone}
        />
        <InfoItem
          icon={DollarSign}
          label="Venmo"
          value={user.venmo}
          onUpdate={onUpdateVenmo}
        />
      </CardContent>
    </Card>
  )
}

interface InfoItemProps {
  icon: React.ElementType
  label: string
  value: string
  verified?: boolean
  onUpdate?: () => void
  onVerify?: () => void
  verificationCooldown?: number
}

function InfoItem({ icon: Icon, label, value, verified, onUpdate, onVerify, verificationCooldown }: InfoItemProps) {
  const formattedValue = label === 'Phone' && value ? formatPhoneNumber(value) : value

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium leading-none">{label}</p>
          <p className="text-sm text-muted-foreground">{formattedValue || 'Not set'}</p>
        </div>
      </div>
      {verified !== undefined ? (
        verified ? (
          <BadgeCheck className="h-5 w-5 text-green-500" />
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onVerify}
            disabled={verificationCooldown! > 0}
          >
            {verificationCooldown! > 0 ? `Resend in ${verificationCooldown}s` : 'Verify'}
          </Button>
        )
      ) : (
        <Button variant="outline" size="sm" onClick={onUpdate}>
          {value ? 'Update' : 'Add'}
        </Button>
      )}
    </div>
  )
}

function formatPhoneNumber(phoneNumber: string) {
  try {
    const parsed = parsePhoneNumber(phoneNumber)
    return parsed.formatInternational()
  } catch (error) {
    console.error('Failed to format phone number:', error)
    return phoneNumber
  }
}
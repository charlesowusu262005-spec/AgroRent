/**
 * @file        EditProfileScreen.tsx
 * @feature     Profile
 * @description Editable profile form with worker-specific skills, rate, and certification fields.
 * @navigation  ProfileStack > EditProfile
 * @data        fetchProfile, updateProfile, setProfileAvatar
 * @consumes    ProfileAvatar, RegionPicker, Input, FARM_SKILLS
 * @author      MiStarStudio
 */

import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { Plus, X } from 'lucide-react-native';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Button, Input, LoadingSpinner, ScreenContainer } from '../../../components';
import type { ProfileStackParamList } from '../../../navigation/types';
import { RegionPicker } from '../../auth/components/RegionPicker';
import { FARM_SKILLS } from '../../labor/constants/skills';
import { ProfileAvatar } from '../components';
import { fetchProfile, updateProfile, setProfileAvatar } from '../slices/profileSlice';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

/** Form to update name, region, avatar, and worker skills/certifications. */
export function EditProfileScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { profile, isLoading, isSaving } = useAppSelector((state) => state.profile);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [certificationFiles, setCertificationFiles] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState('');
  const [newCertName, setNewCertName] = useState('');

  useEffect(() => {
    void dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setEmail(profile.email ?? '');
    setRegion(profile.region ?? '');
    setSkills(profile.skills ?? []);
    setCertifications(profile.certifications ?? []);
    setCertificationFiles(profile.certificationFiles ?? []);
    setHourlyRate(profile.hourlyRate ? String(profile.hourlyRate) : '');
  }, [profile]);

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      dispatch(setProfileAvatar(result.assets[0].uri));
    }
  };

  const pickCertificationFiles = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 5 - certificationFiles.length,
      quality: 0.8,
    });

    if (!result.canceled) {
      setCertificationFiles((prev) => [
        ...prev,
        ...result.assets.map((asset) => asset.uri),
      ].slice(0, 5));
    }
  };

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((item) => item !== skill) : [...prev, skill],
    );
  };

  const addCertification = () => {
    const trimmed = newCertName.trim();
    if (!trimmed) return;
    setCertifications((prev) => [...prev, trimmed]);
    setNewCertName('');
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter your full name.');
      return;
    }

    const result = await dispatch(
      updateProfile({
        name: name.trim(),
        email: email.trim() || undefined,
        region: region || undefined,
        avatarUrl: profile?.avatarUrl,
        skills: profile?.role === 'WORKER' ? skills : undefined,
        certifications: profile?.role === 'WORKER' ? certifications : undefined,
        certificationFiles: profile?.role === 'WORKER' ? certificationFiles : undefined,
        hourlyRate:
          profile?.role === 'WORKER' && hourlyRate ? Number.parseFloat(hourlyRate) : undefined,
      }),
    );

    if (updateProfile.fulfilled.match(result)) {
      Alert.alert('Profile updated', 'Your changes have been saved.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Update failed', 'Could not save your profile. Please try again.');
    }
  };

  if (isLoading && !profile) {
    return <LoadingSpinner label="Loading profile..." />;
  }

  if (!profile) {
    return (
      <ScreenContainer>
        <Text className="text-center text-text-secondary">Profile unavailable</Text>
      </ScreenContainer>
    );
  }

  const isWorker = profile.role === 'WORKER';

  return (
    <ScreenContainer scrollable>
      <View className="items-center pb-6 pt-2">
        <ProfileAvatar
          name={profile.name}
          imageUrl={profile.avatarUrl}
          editable
          onPress={() => void pickAvatar()}
        />
        <Text className="mt-3 text-sm text-text-secondary">Tap to change photo</Text>
      </View>

      <Input label="Full name" value={name} onChangeText={setName} placeholder="Your name" />
      <View className="mt-4">
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View className="mt-4">
        <Input
          label="Phone"
          value={profile.phone}
          editable={false}
          placeholder="Phone number"
        />
        <Text className="mt-1 text-xs text-text-muted">
          Phone is verified. Contact support to change your number via OTP.
        </Text>
      </View>
      <View className="mt-4">
        <RegionPicker value={region} onChange={setRegion} />
      </View>

      {isWorker ? (
        <>
          <View className="mt-6">
            <Text className="mb-3 text-sm font-semibold text-text-primary">Skills</Text>
            <View className="flex-row flex-wrap">
              {FARM_SKILLS.map((skill) => {
                const selected = skills.includes(skill);
                return (
                  <Pressable
                    key={skill}
                    onPress={() => toggleSkill(skill)}
                    className={`mb-2 mr-2 rounded-full border px-3 py-1.5 ${
                      selected ? 'border-primary bg-primary/10' : 'border-gray-200 bg-surface'
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        selected ? 'font-semibold text-primary' : 'text-text-secondary'
                      }`}
                    >
                      {skill}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="mt-6">
            <Input
              label="Hourly rate (GHS)"
              value={hourlyRate}
              onChangeText={setHourlyRate}
              keyboardType="decimal-pad"
              placeholder="25"
            />
          </View>

          <View className="mt-6">
            <Text className="mb-2 text-sm font-semibold text-text-primary">Certifications</Text>
            {certifications.map((cert) => (
              <View
                key={cert}
                className="mb-2 flex-row items-center justify-between rounded-xl bg-gray-50 px-3 py-2"
              >
                <Text className="flex-1 text-sm text-text-primary">{cert}</Text>
                <Pressable
                  onPress={() => setCertifications((prev) => prev.filter((item) => item !== cert))}
                  hitSlop={8}
                >
                  <X size={16} color="#6B7280" />
                </Pressable>
              </View>
            ))}
            <View className="flex-row items-end gap-2">
              <View className="flex-1">
                <Input
                  label="Add certification"
                  value={newCertName}
                  onChangeText={setNewCertName}
                  placeholder="e.g. Pesticide Application Certificate"
                />
              </View>
              <Pressable
                onPress={addCertification}
                className="mb-1 h-12 w-12 items-center justify-center rounded-xl bg-primary"
              >
                <Plus size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          <View className="mt-6">
            <Text className="mb-2 text-sm font-semibold text-text-primary">
              Certification uploads
            </Text>
            <Text className="mb-3 text-xs text-text-muted">
              Upload photos of your certificates (PDF upload via document picker in production).
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {certificationFiles.map((uri) => (
                <Image key={uri} source={{ uri }} className="h-20 w-20 rounded-xl bg-gray-200" />
              ))}
              {certificationFiles.length < 5 ? (
                <Pressable
                  onPress={() => void pickCertificationFiles()}
                  className="h-20 w-20 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50"
                >
                  <Plus size={24} color="#9CA3AF" />
                </Pressable>
              ) : null}
            </View>
          </View>
        </>
      ) : null}

      <View className="mt-8 pb-6">
        <Button
          label="Save Changes"
          onPress={() => void handleSave()}
          loading={isSaving}
          fullWidth
        />
      </View>
    </ScreenContainer>
  );
}

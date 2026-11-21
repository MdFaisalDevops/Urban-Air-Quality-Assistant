import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AqiOverviewCard } from '../components/aqi/AqiOverviewCard';
import { CitySelector } from '../components/aqi/CitySelector';
import { INDIAN_CITIES_STATIONS } from '../data/citiesData';

describe('UI Components & Accessibility', () => {
  const sampleCity = INDIAN_CITIES_STATIONS[0];

  it('renders AqiOverviewCard with station name, AQI value, and health tabs', () => {
    render(<AqiOverviewCard city={sampleCity} />);

    // Station name and AQI should be in document
    expect(screen.getByText(sampleCity.name)).toBeInTheDocument();
    expect(screen.getByText(String(sampleCity.currentAqi))).toBeInTheDocument();
    expect(screen.getByText(sampleCity.category)).toBeInTheDocument();

    // Weather metrics
    expect(screen.getByText(`${sampleCity.weather.temp}°C`)).toBeInTheDocument();

    // Tab buttons for accessibility
    expect(screen.getByRole('tab', { name: /Children & Infants/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Seniors & Asthmatics/i })).toBeInTheDocument();
  });

  it('allows switching family vulnerability tabs in AqiOverviewCard', () => {
    render(<AqiOverviewCard city={sampleCity} />);

    const seniorTab = screen.getByRole('tab', { name: /Seniors & Asthmatics/i });
    fireEvent.click(seniorTab);

    expect(seniorTab).toHaveAttribute('aria-selected', 'true');
  });

  it('filters cities in CitySelector when searching', () => {
    const handleSelect = () => {};
    const handleRefresh = () => {};

    render(
      <CitySelector
        cities={INDIAN_CITIES_STATIONS}
        selectedCityId={sampleCity.id}
        onSelectCity={handleSelect}
        onRefresh={handleRefresh}
        isLoading={false}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search city/i);
    expect(searchInput).toBeInTheDocument();

    // Filter to Kolkata
    fireEvent.change(searchInput, { target: { value: 'Kolkata' } });
    expect(screen.getByText(/Kolkata - Victoria Memorial/i)).toBeInTheDocument();
  });
});

